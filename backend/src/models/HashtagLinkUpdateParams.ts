import Joi from 'joi';

export class HashtagLinkUpdateParams {
	constructor(
		readonly id: number,
		readonly name: string,
		readonly label: string,
	) {}

	static readonly schema = Joi.object<HashtagLinkUpdateParams>({
		id: Joi.number().required(),
		name: Joi.string()
			.required()
			.trim()
			.max(100)
			.regex(/[あ-ん]/u),
		label: Joi.string().required().trim().allow('').max(100),
	});
}
