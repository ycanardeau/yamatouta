import Joi from 'joi';

import { WebLinkUpdateParams } from '../WebLinkUpdateParams';
import { WordCategory } from './WordCategory';

export class TranslationUpdateParams {
	constructor(
		readonly id: number,
		readonly headword: string,
		readonly locale: string,
		readonly reading: string,
		readonly yamatokotoba: string,
		readonly category: WordCategory,
		readonly webLinks: WebLinkUpdateParams[],
	) {}

	static readonly schema = Joi.object<TranslationUpdateParams>({
		id: Joi.number().required(),
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
		webLinks: Joi.array().items(WebLinkUpdateParams.schema).required(),
	});
}
