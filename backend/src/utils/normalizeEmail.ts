import validator from 'validator';

export const normalizeEmail = async (email: string): Promise<string> => {
	const normalizedEmail = validator.normalizeEmail(email);

	if (normalizedEmail === false)
		throw new Error(`Could not normalize email: ${email}`);

	return normalizedEmail.toUpperCase();
};
