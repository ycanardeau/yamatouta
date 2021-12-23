import { Injectable } from '@nestjs/common';

import { PasswordHashAlgorithm } from '../../entities/User';
import { BcryptPasswordHasher } from './BcryptPasswordHasher';
import { IPasswordHasher } from './IPasswordHasher';

@Injectable()
export class PasswordHasherFactory {
	create(algorithm: PasswordHashAlgorithm): IPasswordHasher {
		switch (algorithm) {
			case PasswordHashAlgorithm.Bcrypt:
				return new BcryptPasswordHasher();

			default:
				throw new Error(
					`Unsupported password hash algorithm: ${algorithm}`,
				);
		}
	}

	get default(): IPasswordHasher {
		return this.create(PasswordHashAlgorithm.Bcrypt);
	}
}
