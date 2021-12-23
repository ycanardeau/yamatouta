import { PasswordHashAlgorithm } from '../../entities/User';

export interface IPasswordHasher {
	readonly algorithm: PasswordHashAlgorithm;

	generateSalt(): Promise<string>;
	hashPassword(password: string, salt: string): Promise<string>;
}
