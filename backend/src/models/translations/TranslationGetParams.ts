import { TranslationOptionalField } from '@/models/translations/TranslationOptionalField';
import Joi from 'joi';

export class TranslationGetParams {
	constructor(
		readonly id: number,
		readonly fields?: TranslationOptionalField[],
	) {}

	static readonly schema = Joi.object<TranslationGetParams>({
		id: Joi.number().required(),
		fields: Joi.array()
			.optional()
			.items(
				Joi.string()
					.required()
					.trim()
					.valid(...Object.values(TranslationOptionalField)),
			),
	});
}
