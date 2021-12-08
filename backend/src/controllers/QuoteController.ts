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
		const { quoteType, offset, limit, getTotalCount, artistId } = query;

		return this.listQuotesService.listQuotes({
			quoteType: QuoteType[quoteType as keyof typeof QuoteType],
			// TODO: sort: QuoteSortRule[sort as keyof typeof QuoteSortRule],
			offset: Number(offset),
			limit: Number(limit),
			getTotalCount: getTotalCount === 'true',
			artistId: Number(artistId),
		});
	}

	@Get(':quoteId')
	getQuote(
		@Param('quoteId', ParseIntPipe) quoteId: number,
	): Promise<QuoteObject> {
		return this.getQuoteService.getQuote(quoteId);
	}
}
