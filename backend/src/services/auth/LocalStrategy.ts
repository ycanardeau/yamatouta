import config from '@/config';
import {
	UserAuthenticateCommand,
	UserAuthenticateCommandHandler,
	LoginError,
} from '@/database/commands/users/UserAuthenticateCommandHandler';
import { AuthenticatedUserDto } from '@/dto/AuthenticatedUserDto';
import { TooManyRequestsException } from '@/framework/exceptions/TooManyRequestsException';
import { RateLimiterMariaDb } from '@/services/auth/RateLimiterMariaDb';
import { getClientIp } from '@/utils/getClientIp';
import { EntityManager } from '@mikro-orm/mariadb';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-local';
import { RateLimiterMemory } from 'rate-limiter-flexible';

// Code from: https://gist.github.com/animir/dc59b9da82494437f0a6009589e427f6.
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	private static readonly maxWrongAttemptsByIpPerDay = 100;
	private static readonly maxConsecutiveFailsByEmailAndIp = 10;

	// TODO: Replace with RateLimiterRedis.
	private readonly limiterSlowBruteByIp:
		| RateLimiterMemory
		| RateLimiterMariaDb;
	private readonly limiterConsecutiveFailsByEmailAndIp:
		| RateLimiterMemory
		| RateLimiterMariaDb;

	constructor(
		private readonly authenticateUserCommandHandler: UserAuthenticateCommandHandler,
		em: EntityManager,
	) {
		super({ usernameField: 'email', passReqToCallback: true });

		const mariaDbOptions = {
			storeClient: em.getKnex(),
			storeType: 'knex',
			tableName: 'rate_limit_entries',
			tableCreated: true,
			dbName: config.db.database,
		};

		const limiterSlowBruteByIpOptions = {
			keyPrefix: 'login_fail_ip_per_day',
			points: LocalStrategy.maxWrongAttemptsByIpPerDay,
			duration: 60 * 60 * 24,
			// Block for 1 day, if 10 wrong attempts per day.
			blockDuration: 60 * 60 * 24,
		};

		const limiterConsecutiveFailsByEmailAndIpOptions = {
			keyPrefix: 'login_fail_consecutive_email_and_ip',
			points: LocalStrategy.maxConsecutiveFailsByEmailAndIp,
			// Store number for 90 days since first fail
			duration: 60 * 60 * 24 * 90,
			// Block for 1 hour.
			blockDuration: 60 * 60,
		};

		this.limiterSlowBruteByIp =
			process.env.NODE_ENV === 'test'
				? new RateLimiterMemory(limiterSlowBruteByIpOptions)
				: new RateLimiterMariaDb({
						...mariaDbOptions,
						...limiterSlowBruteByIpOptions,
				  });

		this.limiterConsecutiveFailsByEmailAndIp =
			process.env.NODE_ENV === 'test'
				? new RateLimiterMemory(
						limiterConsecutiveFailsByEmailAndIpOptions,
				  )
				: new RateLimiterMariaDb({
						...mariaDbOptions,
						...limiterConsecutiveFailsByEmailAndIpOptions,
				  });
	}

	async validate(
		request: Request,
		email: string,
		password: string,
	): Promise<AuthenticatedUserDto> {
		const clientIp = getClientIp(request);

		const cacheKey = `${email}_${clientIp}`;

		const [resEmailAndIp, resSlowByIp] = await Promise.all([
			this.limiterConsecutiveFailsByEmailAndIp.get(cacheKey),
			this.limiterSlowBruteByIp.get(clientIp),
		]);

		if (
			resSlowByIp &&
			resSlowByIp.consumedPoints >
				LocalStrategy.maxWrongAttemptsByIpPerDay
		) {
			throw new TooManyRequestsException();
		}

		if (
			resEmailAndIp &&
			resEmailAndIp.consumedPoints >
				LocalStrategy.maxConsecutiveFailsByEmailAndIp
		) {
			throw new TooManyRequestsException();
		}

		const result = await this.authenticateUserCommandHandler.execute(
			new UserAuthenticateCommand({
				email: email,
				password: password,
				clientIp: clientIp,
			}),
		);

		if (result.error === LoginError.None) {
			// Reset on successful authorization.
			await this.limiterConsecutiveFailsByEmailAndIp.delete(cacheKey);

			return result.user;
		}

		// Consume 1 point from limiters on wrong attempt and block if limits reached.
		try {
			await Promise.all([
				this.limiterSlowBruteByIp.consume(clientIp),

				// Count failed attempts by Email + IP only for registered users.
				result.error !== LoginError.NotFound
					? this.limiterConsecutiveFailsByEmailAndIp.consume(cacheKey)
					: undefined,
			]);
		} catch (error) {
			if (error instanceof Error) throw error;

			// TODO: Log.

			throw new TooManyRequestsException();
		}

		throw new UnauthorizedException();
	}
}
