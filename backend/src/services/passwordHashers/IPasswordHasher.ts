import { PasswordHashAlgorithm } from '@/models/PasswordHashAlgorithm';

export interface IPasswordHasher {
	readonly algorithm: PasswordHashAlgorithm;

	generateSalt(): Promise<string>;
	hashPassword(password: string, salt: string): Promise<string>;
}
