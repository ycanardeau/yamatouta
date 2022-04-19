import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
	BadRequestException,
	ForbiddenException,
	Injectable,
} from '@nestjs/common';
import Joi, { ObjectSchema } from 'joi';

import config from '../../../config';
import { AuthenticatedUserObject } from '../../../dto/users/AuthenticatedUserObject';
import { User } from '../../../entities/User';
import { UserEmailAlreadyExistsException } from '../../../exceptions/UserEmailAlreadyExistsException';
import { AuditLogger } from '../../../services/AuditLogger';
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
		readonly username: string,
		readonly email: string,
		readonly password: string,
	) {}
}

@Injectable()
export class CreateUserCommandHandler {
	constructor(
		private readonly em: EntityManager,
		@InjectRepository(User)
		private readonly userRepo: EntityRepository<User>,
		private readonly auditLogger: AuditLogger,
		private readonly passwordHasherFactory: PasswordHasherFactory,
		private readonly permissionContext: PermissionContext,
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

		const user = await this.em.transactional(async () => {
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

			this.auditLogger.user_create({
				actor: user,
				actorIp: this.permissionContext.remoteIpAddress,
				user: user,
			});

			return user;
		});

		return new AuthenticatedUserObject(user);
	}
}
