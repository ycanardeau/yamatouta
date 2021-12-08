import { QuoteSortRule } from '../../dto/quotes/QuoteSortRule';
import { QuoteType } from '../../entities/Quote';

export interface IListQuotesQuery {
	quoteType?: QuoteType;
	sort?: QuoteSortRule;
	offset?: number;
	limit?: number;
	getTotalCount?: boolean;
	artistId?: number;
}

export const listQuotesQuerySchema = {
	$schema: 'http://json-schema.org/draft-07/schema#',
	definitions: {
		QuoteSortRule: {},
	},
	properties: {
		artistId: {
			type: 'number',
		},
		getTotalCount: {
			type: 'boolean',
		},
		limit: {
			type: 'number',
		},
		offset: {
			type: 'number',
		},
		quoteType: {
			enum: ['haiku', 'lyrics', 'other', 'tanka', 'word'],
			type: 'string',
		},
		sort: {
			$ref: '#/definitions/QuoteSortRule',
		},
	},
	type: 'object',
};
