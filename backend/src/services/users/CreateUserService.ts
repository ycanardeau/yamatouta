import { EntityManager } from '@mikro-orm/core';
import { BadRequestException, Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import Joi from 'joi';

import { UserObject } from '../../dto/users/UserObject';
import { User } from '../../entities/User';
import { UserEmailAlreadyExistsException } from '../../exceptions/UserEmailAlreadyExistsException';
import { AuditLogService } from '../AuditLogService';
import { NormalizeEmailService } from './NormalizeEmailService';

@Injectable()
export class CreateUserService {
	constructor(
		private readonly em: EntityManager,
		private readonly auditLogService: AuditLogService,
		private readonly normalizeEmailService: NormalizeEmailService,
	) {}

	async createUser({
		ip,
		...params
	}: {
		username: string;
		email: string;
		password: string;
		ip: string;
	}): Promise<UserObject> {
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

		const user = await this.em.transactional(async (em) => {
			await em
				.findOne(User, { normalizedEmail: normalizedEmail })
				.then((existing) => {
					if (existing) throw new UserEmailAlreadyExistsException();
				});

			const salt = await bcrypt.genSalt(10);

			// TODO: bcrypt has a maximum length input length of 72 bytes.
			const passwordHash = await bcrypt.hash(password, salt);

			const user = new User({
				name: username.trim(),
				email: email,
				normalizedEmail: normalizedEmail,
				salt: salt,
				passwordHashAlgorithm: 'bcrypt',
				passwordHash: passwordHash,
			});

			em.persist(user);

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
