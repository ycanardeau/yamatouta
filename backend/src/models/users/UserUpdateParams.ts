import Joi from 'joi';

export class UserUpdateParams {
	constructor(
		readonly password: string,
		readonly username?: string,
		readonly email?: string,
		readonly newPassword?: string,
	) {}

	static readonly schema = Joi.object<UserUpdateParams>({
		password: Joi.string().required(),
		username: Joi.string().optional().trim().min(2).max(32),
		email: Joi.string().optional().email().max(50),
		newPassword: Joi.string().optional().min(8),
	});
}
