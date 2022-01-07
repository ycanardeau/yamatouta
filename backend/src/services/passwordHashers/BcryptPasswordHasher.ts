import bcrypt from 'bcrypt';

import { PasswordHashAlgorithm } from '../../models/PasswordHashAlgorithm';
import { IPasswordHasher } from './IPasswordHasher';

export class BcryptPasswordHasher implements IPasswordHasher {
	readonly algorithm = PasswordHashAlgorithm.Bcrypt;

	generateSalt(): Promise<string> {
		return bcrypt.genSalt(10);
	}

	hashPassword(password: string, salt: string): Promise<string> {
		// TODO: bcrypt has a maximum length input length of 72 bytes.
		if (new TextEncoder().encode(password).length > 72)
			throw new Error('Password is too long.');

		return bcrypt.hash(password, salt);
	}
}
