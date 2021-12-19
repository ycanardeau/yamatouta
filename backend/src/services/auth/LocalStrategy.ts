import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-local';
import { RateLimiterPostgres } from 'rate-limiter-flexible';

import { UserObject } from '../../dto/users/UserObject';
import { TooManyRequestsException } from '../../exceptions/TooManyRequestsException';
import {
	AuthenticateUserService,
	LoginError,
} from '../users/AuthenticateUserService';

// Code from: https://gist.github.com/animir/dc59b9da82494437f0a6009589e427f6.
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	private static readonly maxWrongAttemptsByIpPerDay = 100;
	private static readonly maxConsecutiveFailsByEmailAndIp = 10;

	// TODO: Replace with RateLimiterRedis.
	private readonly limiterSlowBruteByIp: RateLimiterPostgres;
	private readonly limiterConsecutiveFailsByEmailAndIp: RateLimiterPostgres;

	constructor(
		private readonly authenticateUserService: AuthenticateUserService,
		em: EntityManager,
	) {
		super({ usernameField: 'email', passReqToCallback: true });

		const postgresOptions = {
			storeClient: em.getKnex(),
			storeType: 'knex',
			tableName: 'rate_limit_entries',
			tableCreated: true,
		};

		this.limiterSlowBruteByIp = new RateLimiterPostgres({
			...postgresOptions,
			keyPrefix: 'login_fail_ip_per_day',
			points: LocalStrategy.maxWrongAttemptsByIpPerDay,
			duration: 60 * 60 * 24,
			// Block for 1 day, if 10 wrong attempts per day.
			blockDuration: 60 * 60 * 24,
		});

		this.limiterConsecutiveFailsByEmailAndIp = new RateLimiterPostgres({
			...postgresOptions,
			keyPrefix: 'login_fail_consecutive_email_and_ip',
			points: LocalStrategy.maxConsecutiveFailsByEmailAndIp,
			// Store number for 90 days since first fail
			duration: 60 * 60 * 24 * 90,
			// Block for 1 hour.
			blockDuration: 60 * 60,
		});
	}

	async validate(
		request: Request,
		email: string,
		password: string,
	): Promise<UserObject> {
		const cacheKey = `${email}_${request.ip}`;

		const [resEmailAndIp, resSlowByIp] = await Promise.all([
			this.limiterConsecutiveFailsByEmailAndIp.get(cacheKey),
			this.limiterSlowBruteByIp.get(request.ip),
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

		const result = await this.authenticateUserService.authenticateUser({
			email: email,
			password: password,
			ip: request.ip,
		});

		if (result.error === LoginError.None) {
			// Reset on successful authorization.
			await this.limiterConsecutiveFailsByEmailAndIp.delete(cacheKey);

			return result.user;
		}

		// Consume 1 point from limiters on wrong attempt and block if limits reached.
		try {
			await Promise.all([
				this.limiterSlowBruteByIp.consume(request.ip),

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
