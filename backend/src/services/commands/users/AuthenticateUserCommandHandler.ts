import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';

import { AuthenticatedUserObject } from '../../../dto/users/AuthenticatedUserObject';
import { User } from '../../../entities/User';
import { AuditLogger } from '../../AuditLogger';
import { PasswordHasherFactory } from '../../passwordHashers/PasswordHasherFactory';

export enum LoginError {
	None = 'None',
	NotFound = 'NotFound',
	InvalidPassword = 'InvalidPassword',
}

export type LoginResult =
	| {
			error: LoginError.None;
			user: AuthenticatedUserObject;
	  }
	| {
			error: Exclude<LoginError, LoginError.None>;
			user: undefined;
	  };

const createSuccess = (user: AuthenticatedUserObject): LoginResult => ({
	error: LoginError.None,
	user: user,
});

const createError = (
	error: Exclude<LoginError, LoginError.None>,
): LoginResult => ({
	error: error,
	user: undefined,
});

export class AuthenticateUserCommand {
	constructor(
		readonly email: string,
		readonly password: string,
		readonly ip: string,
	) {}
}

@Injectable()
export class AuthenticateUserCommandHandler {
	constructor(
		private readonly em: EntityManager,
		@InjectRepository(User)
		private readonly userRepo: EntityRepository<User>,
		private readonly auditLogger: AuditLogger,
		private readonly passwordHasherFactory: PasswordHasherFactory,
	) {}

	execute(command: AuthenticateUserCommand): Promise<LoginResult> {
		return this.em.transactional(async () => {
			const user = await this.userRepo.findOne({
				email: command.email,
				deleted: false,
				hidden: false,
			});

			if (!user) return createError(LoginError.NotFound);

			const passwordHasher = this.passwordHasherFactory.create(
				user.passwordHashAlgorithm,
			);

			const passwordHash = await passwordHasher.hashPassword(
				command.password,
				user.salt,
			);

			if (user.passwordHash === passwordHash) {
				this.auditLogger.user_login({
					actor: user,
					actorIp: command.ip,
					user: user,
				});

				const defaultPasswordHasher =
					this.passwordHasherFactory.default;

				if (
					user.passwordHashAlgorithm !==
					defaultPasswordHasher.algorithm
				) {
					await user.updatePassword(
						defaultPasswordHasher,
						command.password,
					);
				}

				return createSuccess(new AuthenticatedUserObject(user));
			}

			this.auditLogger.user_failedLogin({
				actor: user,
				actorIp: command.ip,
				user: user,
			});

			return createError(LoginError.InvalidPassword);
		});
	}
}
