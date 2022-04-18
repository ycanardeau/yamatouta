import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
	BadRequestException,
	ForbiddenException,
	Injectable,
} from '@nestjs/common';
import Joi, { ObjectSchema } from 'joi';

import config from '../../config';
import { AuthenticatedUserObject } from '../../dto/users/AuthenticatedUserObject';
import { User } from '../../entities/User';
import { UserEmailAlreadyExistsException } from '../../exceptions/UserEmailAlreadyExistsException';
import { ICreateUserBody } from '../../requests/auth/ICreateUserBody';
import { normalizeEmail } from '../../utils/normalizeEmail';
import { AuditLogger } from '../AuditLogger';
import { PermissionContext } from '../PermissionContext';
import { PasswordHasherFactory } from '../passwordHashers/PasswordHasherFactory';

@Injectable()
export class CreateUserService {
	constructor(
		private readonly em: EntityManager,
		@InjectRepository(User)
		private readonly userRepo: EntityRepository<User>,
		private readonly auditLogger: AuditLogger,
		private readonly passwordHasherFactory: PasswordHasherFactory,
		private readonly permissionContext: PermissionContext,
	) {}

	// TODO: Use CAPTCHA.
	async execute(params: ICreateUserBody): Promise<AuthenticatedUserObject> {
		if (config.disableAccountCreation)
			throw new ForbiddenException('Account creation is restricted.');

		const schema: ObjectSchema<{
			username: string;
			email: string;
			password: string;
		}> = Joi.object({
			username: Joi.string().required().trim().min(2).max(32),
			email: Joi.string().required().email().max(50),
			password: Joi.string().required().min(8),
		});

		const result = schema.validate(params, { convert: true });

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
