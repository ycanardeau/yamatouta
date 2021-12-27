import Joi, { ObjectSchema } from 'joi';

import { QuoteSortRule } from '../../dto/quotes/QuoteSortRule';
import { QuoteType } from '../../models/QuoteType';

export interface IListQuotesQuery {
	quoteType?: QuoteType;
	sort?: QuoteSortRule;
	offset?: number;
	limit?: number;
	getTotalCount?: boolean;
	artistId?: number;
}

export const listQuotesQuerySchema: ObjectSchema<IListQuotesQuery> = Joi.object(
	{
		quoteType: Joi.string()
			.optional()
			.valid(...Object.values(QuoteType)),
		offset: Joi.number().optional(),
		limit: Joi.number().optional(),
		getTotalCount: Joi.boolean().optional(),
		artistId: Joi.number().optional(),
	},
);
