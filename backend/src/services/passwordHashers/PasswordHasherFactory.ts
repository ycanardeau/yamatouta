import { Injectable } from '@nestjs/common';

import { PasswordHashAlgorithm } from '../../models/PasswordHashAlgorithm';
import { BcryptPasswordHasher } from './BcryptPasswordHasher';
import { IPasswordHasher } from './IPasswordHasher';

@Injectable()
export class PasswordHasherFactory {
	create(algorithm: PasswordHashAlgorithm): IPasswordHasher {
		switch (algorithm) {
			case PasswordHashAlgorithm.Bcrypt:
				return new BcryptPasswordHasher();

			// TODO: Remove.
			case PasswordHashAlgorithm.Inishienomanabi:
				const { InishienomanabiPasswordHasher } =
					// eslint-disable-next-line @typescript-eslint/no-var-requires
					require('./InishienomanabiPasswordHasher');

				return new InishienomanabiPasswordHasher();

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
