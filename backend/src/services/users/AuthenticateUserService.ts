import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';

import { UserObject } from '../../dto/users/UserObject';
import { User } from '../../entities/User';
import { AuditLogService } from '../AuditLogService';
import { PasswordHasherFactory } from '../passwordHashers/PasswordHasherFactory';
import { UpdatePasswordService } from './UpdatePasswordService';

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
		private readonly passwordHasherFactory: PasswordHasherFactory,
		private readonly updatePasswordService: UpdatePasswordService,
	) {}

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

			const passwordHasher = this.passwordHasherFactory.create(
				user.passwordHashAlgorithm,
			);

			const passwordHash = await passwordHasher.hashPassword(
				password,
				user.salt,
			);

			if (user.passwordHash === passwordHash) {
				await this.auditLogService.user_login({
					actor: user,
					actorIp: ip,
					user: user,
				});

				const defaultPasswordHasher =
					this.passwordHasherFactory.default;

				if (
					user.passwordHashAlgorithm !==
					defaultPasswordHasher.algorithm
				) {
					await this.updatePasswordService.updatePassword(
						user,
						defaultPasswordHasher,
						password,
					);
				}

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
