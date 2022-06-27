import Joi from 'joi';

export class HashtagGetParams {
	constructor(readonly name: string) {}

	static readonly schema = Joi.object<HashtagGetParams>({
		name: Joi.string().required().trim(),
	});
}
