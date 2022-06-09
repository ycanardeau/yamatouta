import Joi from 'joi';

import { QuoteSortRule } from './QuoteSortRule';
import { QuoteType } from './QuoteType';

export class QuoteListParams {
	constructor(
		readonly quoteType?: QuoteType,
		readonly sort?: QuoteSortRule,
		readonly offset?: number,
		readonly limit?: number,
		readonly getTotalCount?: boolean,
		readonly artistId?: number,
		readonly workId?: number,
		readonly query?: string,
	) {}

	static readonly schema = Joi.object<QuoteListParams>({
		quoteType: Joi.string()
			.optional()
			.valid(...Object.values(QuoteType)),
		sort: Joi.string()
			.optional()
			.valid(...Object.values(QuoteSortRule)),
		offset: Joi.number().optional(),
		limit: Joi.number().optional(),
		getTotalCount: Joi.boolean().optional(),
		artistId: Joi.number().optional(),
		workId: Joi.number().optional(),
		query: Joi.string().optional().allow(''),
	});
}
