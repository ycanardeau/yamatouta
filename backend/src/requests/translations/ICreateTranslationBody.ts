import Joi from 'joi';

import { WordCategory } from '../../models/WordCategory';

export interface ICreateTranslationBody {
	headword: string;
	locale?: string;
	reading?: string;
	yamatokotoba: string;
	category?: WordCategory;
}

export const createTranslationBodySchema = Joi.object({
	headword: Joi.string().required().trim(),
	locale: Joi.string().optional().trim().allow(''),
	reading: Joi.string().optional().trim().allow(''),
	yamatokotoba: Joi.string().required().trim(),
	category: Joi.string()
		.optional()
		.trim()
		.allow('', ...Object.values(WordCategory)),
});
