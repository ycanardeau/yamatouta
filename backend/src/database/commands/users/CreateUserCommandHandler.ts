import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import Joi, { ObjectSchema } from 'joi';

import config from '../../../config';
import { AuthenticatedUserObject } from '../../../dto/users/AuthenticatedUserObject';
import { User } from '../../../entities/User';
import { UserEmailAlreadyExistsException } from '../../../exceptions/UserEmailAlreadyExistsException';
import { AuditLogEntryFactory } from '../../../services/AuditLogEntryFactory';
import { PermissionContext } from '../../../services/PermissionContext';
import { PasswordHasherFactory } from '../../../services/passwordHashers/PasswordHasherFactory';
import { normalizeEmail } from '../../../utils/normalizeEmail';

export class CreateUserCommand {
	static readonly schema: ObjectSchema<CreateUserCommand> = Joi.object({
		username: Joi.string().required().trim().min(2).max(32),
		email: Joi.string().required().email().max(50),
		password: Joi.string().required().min(8),
	});

	constructor(
		readonly permissionContext: PermissionContext,
		readonly username: string,
		readonly email: string,
		readonly password: string,
	) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler
	implements ICommandHandler<CreateUserCommand>
{
	constructor(
		private readonly em: EntityManager,
		@InjectRepository(User)
		private readonly userRepo: EntityRepository<User>,
		private readonly auditLogEntryFactory: AuditLogEntryFactory,
		private readonly passwordHasherFactory: PasswordHasherFactory,
	) {}

	// TODO: Use CAPTCHA.
	async execute(
		command: CreateUserCommand,
	): Promise<AuthenticatedUserObject> {
		if (config.disableAccountCreation)
			throw new ForbiddenException('Account creation is restricted.');

		const result = CreateUserCommand.schema.validate(command, {
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

			this.userRepo.persist(user);

			const auditLogEntry = this.auditLogEntryFactory.user_create({
				user: user,
				actor: user,
				actorIp: command.permissionContext.clientIp,
			});

			em.persist(auditLogEntry);

			return user;
		});

		return new AuthenticatedUserObject(user);
	}
}
