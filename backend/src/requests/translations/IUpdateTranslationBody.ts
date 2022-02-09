import Joi, { ObjectSchema } from 'joi';

import { WordCategory } from '../../models/WordCategory';

export interface IUpdateTranslationBody {
	headword: string;
	locale: string;
	reading: string;
	yamatokotoba: string;
	category: WordCategory;
}

export const updateTranslationBodySchema: ObjectSchema<IUpdateTranslationBody> =
	Joi.object({
		headword: Joi.string().required().trim().max(200),
		locale: Joi.string().required().trim(),
		reading: Joi.string()
			.required()
			.trim()
			.max(200)
			.regex(/[あ-ん]/u),
		yamatokotoba: Joi.string()
			.required()
			.trim()
			.max(200)
			.regex(/[あ-ん]/u),
		category: Joi.string()
			.required()
			.trim()
			.valid(...Object.values(WordCategory)),
	});
