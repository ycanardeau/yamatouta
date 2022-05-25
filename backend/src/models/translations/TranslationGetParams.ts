import Joi from 'joi';

import { TranslationOptionalField } from './TranslationOptionalField';

export class TranslationGetParams {
	constructor(
		readonly id: number,
		readonly fields?: TranslationOptionalField[],
	) {}

	static readonly schema = Joi.object<TranslationGetParams>({
		id: Joi.number().required(),
		fields: Joi.array().items(
			Joi.string()
				.required()
				.trim()
				.valid(...Object.values(TranslationOptionalField)),
		),
	});
}
