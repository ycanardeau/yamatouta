import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import Joi, { ObjectSchema } from 'joi';

import { AuthenticatedUserObject } from '../../../dto/users/AuthenticatedUserObject';
import { User } from '../../../entities/User';
import { UserEmailAlreadyExistsException } from '../../../exceptions/UserEmailAlreadyExistsException';
import { AuditLogEntryFactory } from '../../../services/AuditLogEntryFactory';
import { PermissionContext } from '../../../services/PermissionContext';
import { PasswordHasherFactory } from '../../../services/passwordHashers/PasswordHasherFactory';
import { normalizeEmail } from '../../../utils/normalizeEmail';

export class UpdateAuthenticatedUserCommand {
	static readonly schema: ObjectSchema<UpdateAuthenticatedUserCommand> =
		Joi.object({
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
		private readonly permissionContext: PermissionContext,
		private readonly em: EntityManager,
		@InjectRepository(User)
		private readonly userRepo: EntityRepository<User>,
		private readonly passwordHasherFactory: PasswordHasherFactory,
		private readonly auditLogEntryFactory: AuditLogEntryFactory,
	) {}

	async execute(
		command: UpdateAuthenticatedUserCommand,
	): Promise<AuthenticatedUserObject> {
		const result = UpdateAuthenticatedUserCommand.schema.validate(command, {
			convert: true,
		});

		if (result.error)
			throw new BadRequestException(result.error.details[0].message);

		return this.em.transactional(async (em) => {
			if (!this.permissionContext.user) throw new BadRequestException();

			const user = await this.userRepo.findOneOrFail({
				id: this.permissionContext.user.id,
				deleted: false,
				hidden: false,
			});

			const passwordHasher = this.passwordHasherFactory.create(
				user.passwordHashAlgorithm,
			);

			const passwordHash = await passwordHasher.hashPassword(
				command.password,
				user.salt,
			);

			if (passwordHash !== user.passwordHash) {
				// TODO: Log.

				throw new BadRequestException();
			}

			if (command.username && command.username !== user.name) {
				const auditLogEntry = this.auditLogEntryFactory.user_rename({
					user: user,
					actor: user,
					actorIp: this.permissionContext.clientIp,
					oldValue: user.name,
					newValue: command.username,
				});

				em.persist(auditLogEntry);

				user.name = command.username;
			}

			if (command.email && command.email !== user.email) {
				const normalizedEmail = await normalizeEmail(command.email);

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
						actorIp: this.permissionContext.clientIp,
						oldValue: user.email,
						newValue: command.email,
					});

				em.persist(auditLogEntry);

				user.email = command.email;
				user.normalizedEmail = normalizedEmail;
			}

			if (command.newPassword) {
				const auditLogEntry =
					this.auditLogEntryFactory.user_changePassword({
						user: user,
						actor: user,
						actorIp: this.permissionContext.clientIp,
					});

				em.persist(auditLogEntry);

				await user.updatePassword(
					this.passwordHasherFactory.default,
					command.newPassword,
				);
			}

			return new AuthenticatedUserObject(user);
		});
	}
}
