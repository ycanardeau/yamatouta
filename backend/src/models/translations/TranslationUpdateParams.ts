import { WebLinkUpdateParams } from '@/models/WebLinkUpdateParams';
import { WorkLinkUpdateParams } from '@/models/WorkLinkUpdateParams';
import { WordCategory } from '@/models/translations/WordCategory';
import Joi from 'joi';

export class TranslationUpdateParams {
	constructor(
		readonly id: number,
		readonly headword: string,
		readonly locale: string,
		readonly reading: string,
		readonly yamatokotoba: string,
		readonly category: WordCategory,
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
		webLinks: Joi.array().required().items(WebLinkUpdateParams.schema),
		workLinks: Joi.array().required().items(WorkLinkUpdateParams.schema),
	});
}
