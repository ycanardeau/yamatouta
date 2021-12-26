// Code from: https://github.com/VocaDB/vocadb/blob/dc352077711421e5d2c07a196aa427cc401b2841/VocaDbModel/Domain/Users/User.cs
import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';

import { User } from '../../entities/User';
import { IPasswordHasher } from '../passwordHashers/IPasswordHasher';

@Injectable()
export class UpdatePasswordService {
	constructor(private readonly em: EntityManager) {}

	updatePassword(
		user: User,
		passwordHasher: IPasswordHasher,
		password: string,
	): Promise<void> {
		return this.em.transactional(async () => {
			if (user.passwordHashAlgorithm !== passwordHasher.algorithm) {
				// TODO: Log.

				user.passwordHashAlgorithm = passwordHasher.algorithm;
				user.salt = await passwordHasher.generateSalt();
			}

			user.passwordHash = await passwordHasher.hashPassword(
				password,
				user.salt,
			);
		});
	}
}
