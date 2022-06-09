import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import config from '../../../config';
import { AuthenticatedUserObject } from '../../../dto/AuthenticatedUserObject';
import { UserAuditLogEntry } from '../../../entities/AuditLogEntry';
import { User } from '../../../entities/User';
import { UserEmailAlreadyExistsException } from '../../../framework/exceptions/UserEmailAlreadyExistsException';
import { AuditedAction } from '../../../models/AuditedAction';
import { UserCreateParams } from '../../../models/users/UserCreateParams';
import { NgramConverter } from '../../../services/NgramConverter';
import { PermissionContext } from '../../../services/PermissionContext';
import { PasswordHasherFactory } from '../../../services/passwordHashers/PasswordHasherFactory';
import { normalizeEmail } from '../../../utils/normalizeEmail';

export class UserCreateCommand {
	constructor(
		readonly permissionContext: PermissionContext,
		readonly params: UserCreateParams,
	) {}
}

@CommandHandler(UserCreateCommand)
export class UserCreateCommandHandler
	implements ICommandHandler<UserCreateCommand>
{
	constructor(
		private readonly em: EntityManager,
		@InjectRepository(User)
		private readonly userRepo: EntityRepository<User>,
		private readonly passwordHasherFactory: PasswordHasherFactory,
		private readonly ngramConverter: NgramConverter,
	) {}

	// TODO: Use CAPTCHA.
	async execute(
		command: UserCreateCommand,
	): Promise<AuthenticatedUserObject> {
		const { permissionContext, params } = command;

		if (config.disableAccountCreation)
			throw new ForbiddenException('Account creation is restricted.');

		const result = UserCreateParams.schema.validate(params, {
			convert: true,
		});

		if (result.error)
			throw new BadRequestException(result.error.details[0].message);

		const { username, email, password } = result.value;

		const normalizedEmail = await normalizeEmail(email);

		const user = await this.em.transactional(async (em) => {
			await this.userRepo
				.findOne({ normalizedEmail: normalizedEmail })
				.then((existing) => {
					if (existing) throw new UserEmailAlreadyExistsException();
				});

			const passwordHasher = this.passwordHasherFactory.default;

			const salt = await passwordHasher.generateSalt();

			const passwordHash = await passwordHasher.hashPassword(
				password,
				salt,
			);

			const user = new User({
				name: username.trim(),
				email: email,
				normalizedEmail: normalizedEmail,
				salt: salt,
				passwordHashAlgorithm: passwordHasher.algorithm,
				passwordHash: passwordHash,
			});

			user.updateSearchIndex(this.ngramConverter);

			this.userRepo.persist(user);

			const auditLogEntry = new UserAuditLogEntry({
				action: AuditedAction.User_Create,
				user: user,
				actor: user,
				actorIp: permissionContext.clientIp,
			});

			em.persist(auditLogEntry);

			return user;
		});

		return AuthenticatedUserObject.create(user);
	}
}
