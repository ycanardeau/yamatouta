import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import Joi from 'joi';

import { AuthenticatedUserObject } from '../../../dto/users/AuthenticatedUserObject';
import { User } from '../../../entities/User';
import { UserEmailAlreadyExistsException } from '../../../exceptions/UserEmailAlreadyExistsException';
import { AuditLogEntryFactory } from '../../../services/AuditLogEntryFactory';
import { PermissionContext } from '../../../services/PermissionContext';
import { PasswordHasherFactory } from '../../../services/passwordHashers/PasswordHasherFactory';
import { normalizeEmail } from '../../../utils/normalizeEmail';

export class UpdateAuthenticatedUserParams {
	static readonly schema = Joi.object<UpdateAuthenticatedUserParams>({
		password: Joi.string().required(),
		username: Joi.string().optional().trim().min(2).max(32),
		email: Joi.string().optional().email().max(50),
		newPassword: Joi.string().optional().min(8),
	});

	constructor(
		readonly password: string,
		readonly username?: string,
		readonly email?: string,
		readonly newPassword?: string,
	) {}
}

export class UpdateAuthenticatedUserCommand {
	constructor(
		readonly permissionContext: PermissionContext,
		readonly params: UpdateAuthenticatedUserParams,
	) {}
}

export const updateAuthenticatedUserBodySchema = Joi.object({
	password: Joi.string().required(),
	username: Joi.string().optional(),
	email: Joi.string().optional(),
	newPassword: Joi.string().optional(),
});

@CommandHandler(UpdateAuthenticatedUserCommand)
export class UpdateAuthenticatedUserCommandHandler
	implements ICommandHandler<UpdateAuthenticatedUserCommand>
{
	constructor(
		private readonly em: EntityManager,
		@InjectRepository(User)
		private readonly userRepo: EntityRepository<User>,
		private readonly passwordHasherFactory: PasswordHasherFactory,
		private readonly auditLogEntryFactory: AuditLogEntryFactory,
	) {}

	async execute(
		command: UpdateAuthenticatedUserCommand,
	): Promise<AuthenticatedUserObject> {
		const { permissionContext, params } = command;

		const result = UpdateAuthenticatedUserParams.schema.validate(params, {
			convert: true,
		});

		if (result.error)
			throw new BadRequestException(result.error.details[0].message);

		return this.em.transactional(async (em) => {
			if (!permissionContext.user) throw new BadRequestException();

			const user = await this.userRepo.findOneOrFail({
				id: permissionContext.user.id,
				deleted: false,
				hidden: false,
			});

			const passwordHasher = this.passwordHasherFactory.create(
				user.passwordHashAlgorithm,
			);

			const passwordHash = await passwordHasher.hashPassword(
				params.password,
				user.salt,
			);

			if (passwordHash !== user.passwordHash) {
				// TODO: Log.

				throw new BadRequestException();
			}

			if (params.username && params.username !== user.name) {
				const auditLogEntry = this.auditLogEntryFactory.user_rename({
					user: user,
					actor: user,
					actorIp: permissionContext.clientIp,
					oldValue: user.name,
					newValue: params.username,
				});

				em.persist(auditLogEntry);

				user.name = params.username;
			}

			if (params.email && params.email !== user.email) {
				const normalizedEmail = await normalizeEmail(params.email);

				await this.userRepo
					.findOne({
						normalizedEmail: normalizedEmail,
					})
					.then((existing) => {
						if (existing)
							throw new UserEmailAlreadyExistsException();
					});

				const auditLogEntry =
					this.auditLogEntryFactory.user_changeEmail({
						user: user,
						actor: user,
						actorIp: permissionContext.clientIp,
						oldValue: user.email,
						newValue: params.email,
					});

				em.persist(auditLogEntry);

				user.email = params.email;
				user.normalizedEmail = normalizedEmail;
			}

			if (params.newPassword) {
				const auditLogEntry =
					this.auditLogEntryFactory.user_changePassword({
						user: user,
						actor: user,
						actorIp: permissionContext.clientIp,
					});

				em.persist(auditLogEntry);

				await user.updatePassword(
					this.passwordHasherFactory.default,
					params.newPassword,
				);
			}

			return new AuthenticatedUserObject(user);
		});
	}
}
