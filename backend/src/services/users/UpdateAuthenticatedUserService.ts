import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';

import { AuthenticatedUserObject } from '../../dto/users/AuthenticatedUserObject';
import { User } from '../../entities/User';
import { IUpdateAuthenticatedUserBody } from '../../requests/users/IUpdateAuthenticatedUserBody';
import { PermissionContext } from '../PermissionContext';
import { PasswordHasherFactory } from '../passwordHashers/PasswordHasherFactory';
import { NormalizeEmailService } from './NormalizeEmailService';

@Injectable()
export class UpdateAuthenticatedUserService {
	constructor(
		private readonly permissionContext: PermissionContext,
		private readonly em: EntityManager,
		@InjectRepository(User)
		private readonly userRepo: EntityRepository<User>,
		private readonly passwordHasherFactory: PasswordHasherFactory,
		private readonly normalizeEmailService: NormalizeEmailService,
	) {}

	updateAuthenticatedUser(
		params: IUpdateAuthenticatedUserBody,
	): Promise<AuthenticatedUserObject> {
		const { password, username, email, newPassword } = params;

		return this.em.transactional(async () => {
			if (!this.permissionContext.user) throw new BadRequestException();

			// TODO: Validate.

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

			// TODO: Log.

			if (username) {
				// TODO: Validate.

				user.name = username;
			}

			if (email) {
				// TODO: Validate.

				user.email = email;
				user.normalizedEmail =
					await this.normalizeEmailService.normalizeEmail(email);
			}

			if (newPassword) {
				// TODO: Validate.

				await user.updatePassword(
					this.passwordHasherFactory.default,
					newPassword,
				);
			}

			return new AuthenticatedUserObject(user);
		});
	}
}
