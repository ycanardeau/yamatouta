import validator from 'validator';

export class NormalizeEmailService {
	async normalizeEmail(email: string): Promise<string> {
		const normalizedEmail = validator.normalizeEmail(email);

		if (normalizedEmail === false)
			throw new Error(`Could not normalize email: ${email}`);

		return normalizedEmail.toUpperCase();
	}
}
