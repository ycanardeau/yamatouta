import Joi from 'joi';

import { HashtagUpdateParams } from '../HashtagUpdateParams';
import { WebLinkUpdateParams } from '../WebLinkUpdateParams';
import { WorkLinkUpdateParams } from '../WorkLinkUpdateParams';
import { QuoteType } from './QuoteType';

export class QuoteUpdateParams {
	constructor(
		readonly id: number,
		readonly text: string,
		readonly quoteType: QuoteType,
		readonly locale: string,
		readonly artistId: number,
		readonly hashtags: HashtagUpdateParams[],
		readonly webLinks: WebLinkUpdateParams[],
		readonly workLinks: WorkLinkUpdateParams[],
	) {}

	static readonly schema = Joi.object<QuoteUpdateParams>({
		id: Joi.number().required(),
		text: Joi.string().required().trim().max(200),
		quoteType: Joi.string()
			.required()
			.trim()
			.valid(...Object.values(QuoteType)),
		locale: Joi.string().required().trim(),
		artistId: Joi.number().required(),
		hashtags: Joi.array().items(HashtagUpdateParams.schema).required(),
		webLinks: Joi.array().items(WebLinkUpdateParams.schema).required(),
		workLinks: Joi.array().items(WorkLinkUpdateParams.schema).required(),
	});
}
