import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';

import { UserObject } from '../../dto/users/UserObject';
import { User } from '../../entities/User';
import { AuditLogService } from '../AuditLogService';

export enum LoginError {
	None,
	NotFound,
	InvalidPassword,
}

export type LoginResult =
	| {
			error: LoginError.None;
			user: UserObject;
	  }
	| {
			error: Exclude<LoginError, LoginError.None>;
			user: undefined;
	  };

const createSuccess = (user: UserObject): LoginResult => ({
	error: LoginError.None,
	user: user,
});

const createError = (
	error: Exclude<LoginError, LoginError.None>,
): LoginResult => ({
	error: error,
	user: undefined,
});

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

	authenticateUser(params: {
		email: string;
		password: string;
		ip: string;
	}): Promise<LoginResult> {
		const { email, password, ip } = params;

		return this.em.transactional(async (em) => {
			const user = await em.findOne(User, {
				email: email,
				deleted: false,
				hidden: false,
			});

			if (!user) return createError(LoginError.NotFound);

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

				return createSuccess(new UserObject(user));
			}

			await this.auditLogService.user_failedLogin({
				actor: user,
				actorIp: ip,
				user: user,
			});

			return createError(LoginError.InvalidPassword);
		});
	}
}
