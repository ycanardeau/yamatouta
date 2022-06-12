import Joi from 'joi';

export class HashtagUpdateParams {
	constructor(readonly id: number, readonly name: string) {}

	static readonly schema = Joi.object<HashtagUpdateParams>({
		id: Joi.number().required(),
		name: Joi.string().required(),
	});
}
