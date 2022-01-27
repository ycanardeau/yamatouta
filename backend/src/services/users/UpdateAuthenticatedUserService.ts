import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';

import { AuthenticatedUserObject } from '../../dto/users/AuthenticatedUserObject';
import { User } from '../../entities/User';
import { PermissionContext } from '../PermissionContext';
import { PasswordHasherFactory } from '../passwordHashers/PasswordHasherFactory';
import { UpdatePasswordService } from './UpdatePasswordService';

@Injectable()
export class UpdateAuthenticatedUserService {
	constructor(
		private readonly permissionContext: PermissionContext,
		private readonly em: EntityManager,
		@InjectRepository(User)
		private readonly userRepo: EntityRepository<User>,
		private readonly passwordHasherFactory: PasswordHasherFactory,
		private readonly updatePasswordService: UpdatePasswordService,
	) {}

	updateAuthenticatedUser(params: {
		password: string;
		email?: string;
		newPassword?: string;
	}): Promise<AuthenticatedUserObject> {
		const { password, email, newPassword } = params;

		return this.em.transactional(async () => {
			if (!this.permissionContext.user) throw new BadRequestException();

			// TODO: Validate.

			const user = await this.userRepo.findOneOrFail({
				id: this.permissionContext.user.id,
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

			if (email) {
				// TODO: Log.

				user.email = email;
			}

			if (newPassword) {
				// TODO: Log.

				await this.updatePasswordService.updatePassword(
					user,
					this.passwordHasherFactory.default,
					newPassword,
				);
			}

			return new AuthenticatedUserObject(user);
		});
	}
}
