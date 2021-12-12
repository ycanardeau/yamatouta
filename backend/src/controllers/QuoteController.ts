import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';

import { SearchResultObject } from '../dto/SearchResultObject';
import { QuoteObject } from '../dto/quotes/QuoteObject';
import { QuoteType } from '../entities/Quote';
import { ListQuotesQuery } from '../requests/quotes/ListQuotesQuery';
import { GetQuoteService } from '../services/quotes/GetQuoteService';
import { ListQuotesService } from '../services/quotes/ListQuotesService';

@Controller('quotes')
export class QuoteController {
	constructor(
		private readonly listQuotesService: ListQuotesService,
		private readonly getQuoteService: GetQuoteService,
	) {}

	@Get()
	listQuotes(
		@Query() query: ListQuotesQuery,
	): Promise<SearchResultObject<QuoteObject>> {
		return this.listQuotesService.listQuotes({
			quoteType: QuoteType[query.quoteType as keyof typeof QuoteType],
			// TODO: sort: QuoteSortRule[query.sort as keyof typeof QuoteSortRule],
			offset: Number(query.offset),
			limit: Number(query.limit),
			getTotalCount: query.getTotalCount === 'true',
			artistId: Number(query.artistId),
		});
	}

	@Get(':quoteId')
	getQuote(
		@Param('quoteId', ParseIntPipe) quoteId: number,
	): Promise<QuoteObject> {
		return this.getQuoteService.getQuote(quoteId);
	}
}
