import Joi from 'joi';

import { HashtagLinkUpdateParams } from '../HashtagLinkUpdateParams';
import { WebLinkUpdateParams } from '../WebLinkUpdateParams';
import { WorkLinkUpdateParams } from '../WorkLinkUpdateParams';
import { WordCategory } from './WordCategory';

export class TranslationUpdateParams {
	constructor(
		readonly id: number,
		readonly headword: string,
		readonly locale: string,
		readonly reading: string,
		readonly yamatokotoba: string,
		readonly category: WordCategory,
		readonly hashtagLinks: HashtagLinkUpdateParams[],
		readonly webLinks: WebLinkUpdateParams[],
		readonly workLinks: WorkLinkUpdateParams[],
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
		hashtagLinks: Joi.array()
			.required()
			.items(HashtagLinkUpdateParams.schema),
		webLinks: Joi.array().required().items(WebLinkUpdateParams.schema),
		workLinks: Joi.array().required().items(WorkLinkUpdateParams.schema),
	});
}
