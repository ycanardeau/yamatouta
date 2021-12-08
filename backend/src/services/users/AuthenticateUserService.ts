import { EntityManager } from '@mikro-orm/core';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import bcrypt from 'bcrypt';

import { UserObject } from '../../dto/users/UserObject';
import { User } from '../../entities/User';
import { AuditLogService } from '../AuditLogService';

@Injectable()
export class AuthenticateUserService {
	constructor(
		private readonly em: EntityManager,
		private readonly auditLogService: AuditLogService,
	) {}

	private hashPassword(params: {
		algorithm: string;
		password: string;
		salt: string;
	}): Promise<string> {
		const { algorithm, password, salt } = params;

		switch (algorithm) {
			case 'bcrypt':
				// TODO: bcrypt has a maximum length input length of 72 bytes.
				return bcrypt.hash(password, salt);

			default:
				throw new Error(
					`Unsupported password hash algorithm: ${algorithm}`,
				);
		}
	}

	async authenticateUser(params: {
		email: string;
		password: string;
		ip: string;
	}): Promise<UserObject> {
		const { email, password, ip } = params;

		const user = await this.em.transactional(async (em) => {
			const user = await em.findOne(User, {
				email: email,
				deleted: false,
				hidden: false,
			});

			if (!user) throw new UnauthorizedException();

			const passwordHash = await this.hashPassword({
				algorithm: user.passwordHashAlgorithm,
				password: password,
				salt: user.salt,
			});

			if (user.passwordHash === passwordHash) {
				await this.auditLogService.user_login({
					actor: user,
					actorIp: ip,
					user: user,
				});

				return user;
			}

			await this.auditLogService.user_failedLogin({
				actor: user,
				actorIp: ip,
				user: user,
			});

			throw new UnauthorizedException();
		});

		return new UserObject(user);
	}
}
