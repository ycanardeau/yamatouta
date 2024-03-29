import { AuthenticatedUserDto } from '@/dto/AuthenticatedUserDto';
import { UserAuditLogEntry } from '@/entities/AuditLogEntry';
import { User } from '@/entities/User';
import { UserEmailAlreadyExistsException } from '@/framework/exceptions/UserEmailAlreadyExistsException';
import { AuditedAction } from '@/models/AuditedAction';
import { UserUpdateParams } from '@/models/users/UserUpdateParams';
import { NgramConverter } from '@/services/NgramConverter';
import { PermissionContext } from '@/services/PermissionContext';
import { PasswordHasherFactory } from '@/services/passwordHashers/PasswordHasherFactory';
import { normalizeEmail } from '@/utils/normalizeEmail';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class UserUpdateCommand {
	constructor(
		readonly permissionContext: PermissionContext,
		readonly params: UserUpdateParams,
	) {}
}

@CommandHandler(UserUpdateCommand)
export class UserUpdateCommandHandler
	implements ICommandHandler<UserUpdateCommand>
{
	constructor(
		private readonly em: EntityManager,
		@InjectRepository(User)
		private readonly userRepo: EntityRepository<User>,
		private readonly passwordHasherFactory: PasswordHasherFactory,
		private readonly ngramConverter: NgramConverter,
	) {}

	async execute(command: UserUpdateCommand): Promise<AuthenticatedUserDto> {
		const { permissionContext, params } = command;

		const result = UserUpdateParams.schema.validate(params, {
			convert: true,
		});

		if (result.error)
			throw new BadRequestException(result.error.details[0].message);

		return this.em.transactional(async (em) => {
			const actor = await permissionContext.getCurrentUser(em);

			const user = await this.userRepo.findOneOrFail(
				{
					id: actor.id,
					deleted: false,
					hidden: false,
				},
				{
					populate: ['searchIndex'],
				},
			);

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
				const auditLogEntry = new UserAuditLogEntry({
					action: AuditedAction.User_Rename,
					user: user,
					actor: actor,
					actorIp: permissionContext.clientIp,
					oldValue: user.name,
					newValue: params.username,
				});

				em.persist(auditLogEntry);

				user.name = params.username;

				user.updateSearchIndex(this.ngramConverter);
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

				const auditLogEntry = new UserAuditLogEntry({
					action: AuditedAction.User_ChangeEmail,
					user: user,
					actor: actor,
					actorIp: permissionContext.clientIp,
					oldValue: user.email,
					newValue: params.email,
				});

				em.persist(auditLogEntry);

				user.email = params.email;
				user.normalizedEmail = normalizedEmail;
			}

			if (params.newPassword) {
				const auditLogEntry = new UserAuditLogEntry({
					action: AuditedAction.User_ChangePassword,
					user: user,
					actor: actor,
					actorIp: permissionContext.clientIp,
				});

				em.persist(auditLogEntry);

				await user.updatePassword(
					this.passwordHasherFactory.default,
					params.newPassword,
				);
			}

			return AuthenticatedUserDto.create(user);
		});
	}
}
