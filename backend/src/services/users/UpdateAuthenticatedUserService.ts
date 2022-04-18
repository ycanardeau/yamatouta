import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import Joi, { ObjectSchema } from 'joi';

import { AuthenticatedUserObject } from '../../dto/users/AuthenticatedUserObject';
import { User } from '../../entities/User';
import { UserEmailAlreadyExistsException } from '../../exceptions/UserEmailAlreadyExistsException';
import { IUpdateAuthenticatedUserBody } from '../../requests/users/IUpdateAuthenticatedUserBody';
import { normalizeEmail } from '../../utils/normalizeEmail';
import { AuditLogger } from '../AuditLogger';
import { PermissionContext } from '../PermissionContext';
import { PasswordHasherFactory } from '../passwordHashers/PasswordHasherFactory';

@Injectable()
export class UpdateAuthenticatedUserService {
	constructor(
		private readonly permissionContext: PermissionContext,
		private readonly em: EntityManager,
		@InjectRepository(User)
		private readonly userRepo: EntityRepository<User>,
		private readonly passwordHasherFactory: PasswordHasherFactory,
		private readonly auditLogger: AuditLogger,
	) {}

	async execute(
		params: IUpdateAuthenticatedUserBody,
	): Promise<AuthenticatedUserObject> {
		const { password, username, email, newPassword } = params;

		const schema: ObjectSchema<{
			username: string;
			email: string;
			password: string;
		}> = Joi.object({
			password: Joi.string().required(),
			username: Joi.string().optional().trim().min(2).max(32),
			email: Joi.string().optional().email().max(50),
			newPassword: Joi.string().optional().min(8),
		});

		const result = schema.validate(params, { convert: true });

		if (result.error)
			throw new BadRequestException(result.error.details[0].message);

		return this.em.transactional(async () => {
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
				password,
				user.salt,
			);

			if (passwordHash !== user.passwordHash) {
				// TODO: Log.

				throw new BadRequestException();
			}

			if (username && username !== user.name) {
				this.auditLogger.user_rename({
					actor: user,
					actorIp: this.permissionContext.remoteIpAddress,
					user: user,
					oldValue: user.name,
					newValue: username,
				});

				user.name = username;
			}

			if (email && email !== user.email) {
				const normalizedEmail = await normalizeEmail(email);

				await this.userRepo
					.findOne({
						normalizedEmail: normalizedEmail,
					})
					.then((existing) => {
						if (existing)
							throw new UserEmailAlreadyExistsException();
					});

				this.auditLogger.user_changeEmail({
					actor: user,
					actorIp: this.permissionContext.remoteIpAddress,
					user: user,
					oldValue: user.email,
					newValue: email,
				});

				user.email = email;
				user.normalizedEmail = normalizedEmail;
			}

			if (newPassword) {
				this.auditLogger.user_changePassword({
					actor: user,
					actorIp: this.permissionContext.remoteIpAddress,
					user: user,
				});

				await user.updatePassword(
					this.passwordHasherFactory.default,
					newPassword,
				);
			}

			return new AuthenticatedUserObject(user);
		});
	}
}
