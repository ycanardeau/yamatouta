import { Controller, Get } from '@nestjs/common';
import { AjvQuery } from 'nestjs-ajv-glue/dist';

import { SearchResultDto } from '../../../dto/SearchResultDto';
import { QuoteDto } from '../../../dto/quotes/QuoteDto';
import { QuoteSortRule } from '../../../dto/quotes/QuoteSortRule';
import { QuoteType } from '../../../entities/Quote';
import { ListQuotesService } from './list-quotes.service';

interface IListQuotesQuery {
	quoteType?: QuoteType;
	sort?: QuoteSortRule;
	offset?: number;
	limit?: number;
	getTotalCount?: boolean;
	artistId?: number;
}

const listQuotesQuerySchema = {
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

@Controller()
export class ListQuotesController {
	constructor(private readonly service: ListQuotesService) {}

	@Get('quotes')
	listQuotes(
		@AjvQuery(listQuotesQuerySchema) query: IListQuotesQuery,
	): Promise<SearchResultDto<QuoteDto>> {
		return this.service.listQuotes(query);
	}
}
