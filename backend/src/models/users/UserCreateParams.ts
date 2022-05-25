import Joi from 'joi';

export class UserCreateParams {
	constructor(
		readonly username: string,
		readonly email: string,
		readonly password: string,
	) {}

	static readonly schema = Joi.object<UserCreateParams>({
		username: Joi.string().required().trim().min(2).max(32),
		email: Joi.string().required().email().max(50),
		password: Joi.string().required().min(8),
	});
}
