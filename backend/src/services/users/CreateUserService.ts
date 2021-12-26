import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
	BadRequestException,
	ForbiddenException,
	Injectable,
} from '@nestjs/common';
import Joi from 'joi';

import config from '../../config';
import { UserObject } from '../../dto/users/UserObject';
import { User } from '../../entities/User';
import { UserEmailAlreadyExistsException } from '../../exceptions/UserEmailAlreadyExistsException';
import { AuditLogService } from '../AuditLogService';
import { PasswordHasherFactory } from '../passwordHashers/PasswordHasherFactory';
import { NormalizeEmailService } from './NormalizeEmailService';

@Injectable()
export class CreateUserService {
	constructor(
		private readonly em: EntityManager,
		@InjectRepository(User)
		private readonly userRepo: EntityRepository<User>,
		private readonly auditLogService: AuditLogService,
		private readonly normalizeEmailService: NormalizeEmailService,
		private readonly passwordHasherFactory: PasswordHasherFactory,
	) {}

	// TODO: Use CAPTCHA.
	async createUser({
		ip,
		...params
	}: {
		username: string;
		email: string;
		password: string;
		ip: string;
	}): Promise<UserObject> {
		if (config.disableAccountCreation)
			throw new ForbiddenException('Account creation is restricted.');

		const schema = Joi.object({
			username: Joi.string().required().trim().min(2).max(32),
			email: Joi.string().required().email().max(50),
			password: Joi.string().required().min(8),
		});

		const { error } = schema.validate(params);

		if (error) throw new BadRequestException(error.details[0].message);

		const { username, email, password } = params;

		const normalizedEmail = await this.normalizeEmailService.normalizeEmail(
			email,
		);

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

			await this.auditLogService.user_create({
				actor: user,
				actorIp: ip,
				user: user,
			});

			return user;
		});

		return new UserObject(user);
	}
}
