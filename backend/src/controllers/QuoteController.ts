import { Controller, Get } from '@nestjs/common';
import { AjvParams, AjvQuery } from 'nestjs-ajv-glue/dist';

import { SearchResultObject } from '../dto/SearchResultObject';
import { QuoteObject } from '../dto/quotes/QuoteObject';
import {
	getQuoteParamsSchema,
	IGetQuoteParams,
} from '../requests/quotes/IGetQuoteParams';
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
		@AjvQuery(listQuotesQuerySchema)
		query: IListQuotesQuery,
	): Promise<SearchResultObject<QuoteObject>> {
		return this.listQuotesService.listQuotes(query);
	}

	@Get(':quoteId')
	getQuote(
		@AjvParams(getQuoteParamsSchema)
		{ quoteId }: IGetQuoteParams,
	): Promise<QuoteObject> {
		return this.getQuoteService.getQuote(quoteId);
	}
}
