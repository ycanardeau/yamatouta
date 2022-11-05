import { AuthenticatedUserObject } from '@/dto/AuthenticatedUserObject';
import { UserAuditLogEntry } from '@/entities/AuditLogEntry';
import { User } from '@/entities/User';
import { AuditedAction } from '@/models/AuditedAction';
import { UserAuthenticateParams } from '@/models/users/UserAuthenticateParams';
import { PasswordHasherFactory } from '@/services/passwordHashers/PasswordHasherFactory';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

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

export class UserAuthenticateCommand {
	constructor(readonly params: UserAuthenticateParams) {}
}

@CommandHandler(UserAuthenticateCommand)
export class UserAuthenticateCommandHandler
	implements ICommandHandler<UserAuthenticateCommand>
{
	constructor(
		private readonly em: EntityManager,
		@InjectRepository(User)
		private readonly userRepo: EntityRepository<User>,
		private readonly passwordHasherFactory: PasswordHasherFactory,
	) {}

	execute(command: UserAuthenticateCommand): Promise<LoginResult> {
		const { params } = command;

		return this.em.transactional(async (em) => {
			const user = await this.userRepo.findOne({
				email: params.email,
				deleted: false,
				hidden: false,
			});

			if (!user) return createError(LoginError.NotFound);

			const passwordHasher = this.passwordHasherFactory.create(
				user.passwordHashAlgorithm,
			);

			const passwordHash = await passwordHasher.hashPassword(
				params.password,
				user.salt,
			);

			if (user.passwordHash === passwordHash) {
				const auditLogEntry = new UserAuditLogEntry({
					action: AuditedAction.User_Login,
					user: user,
					actor: user,
					actorIp: params.clientIp,
				});

				em.persist(auditLogEntry);

				const defaultPasswordHasher =
					this.passwordHasherFactory.default;

				if (
					user.passwordHashAlgorithm !==
					defaultPasswordHasher.algorithm
				) {
					await user.updatePassword(
						defaultPasswordHasher,
						params.password,
					);
				}

				return createSuccess(AuthenticatedUserObject.create(user));
			}

			const auditLogEntry = new UserAuditLogEntry({
				action: AuditedAction.User_FailedLogin,
				user: user,
				actor: user,
				actorIp: params.clientIp,
			});

			em.persist(auditLogEntry);

			return createError(LoginError.InvalidPassword);
		});
	}
}
