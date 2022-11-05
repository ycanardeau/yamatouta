import { WebLinkUpdateParams } from '@/models/WebLinkUpdateParams';
import { WorkLinkUpdateParams } from '@/models/WorkLinkUpdateParams';
import { QuoteType } from '@/models/quotes/QuoteType';
import Joi from 'joi';

export class QuoteUpdateParams {
	constructor(
		readonly id: number,
		readonly text: string,
		readonly quoteType: QuoteType,
		readonly locale: string,
		readonly artistId: number,
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
		webLinks: Joi.array().required().items(WebLinkUpdateParams.schema),
		workLinks: Joi.array().required().items(WorkLinkUpdateParams.schema),
	});
}
