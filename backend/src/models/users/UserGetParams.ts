import Joi from 'joi';

export class UserGetParams {
	constructor(readonly id: number) {}

	static readonly schema = Joi.object<UserGetParams>({
		id: Joi.number().required(),
	});
}
