import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';

import { SearchResultObject } from '../dto/SearchResultObject';
import { QuoteObject } from '../dto/quotes/QuoteObject';
import { JoiValidationPipe } from '../pipes/JoiValidationPipe';
import {
	IListQuotesQuery,
	listQuotesQuerySchema,
} from '../requests/quotes/IListQuotesQuery';
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
		@Query(new JoiValidationPipe(listQuotesQuerySchema))
		query: IListQuotesQuery,
	): Promise<SearchResultObject<QuoteObject>> {
		return this.listQuotesService.listQuotes(query);
	}

	@Get(':quoteId')
	getQuote(
		@Param('quoteId', ParseIntPipe) quoteId: number,
	): Promise<QuoteObject> {
		return this.getQuoteService.getQuote(quoteId);
	}
}
