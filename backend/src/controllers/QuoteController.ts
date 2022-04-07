import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Post,
	Query,
} from '@nestjs/common';

import { SearchResultObject } from '../dto/SearchResultObject';
import { QuoteObject } from '../dto/quotes/QuoteObject';
import { RevisionObject } from '../dto/revisions/RevisionObject';
import { JoiValidationPipe } from '../pipes/JoiValidationPipe';
import {
	IListQuotesQuery,
	listQuotesQuerySchema,
} from '../requests/quotes/IListQuotesQuery';
import {
	IUpdateQuoteBody,
	updateQuoteBodySchema,
} from '../requests/quotes/IUpdateQuoteBody';
import { DeleteQuoteService } from '../services/entries/DeleteEntryService';
import { ListQuoteRevisionsService } from '../services/entries/ListEntryRevisionsService';
import { CreateQuoteService } from '../services/quotes/CreateQuoteService';
import { GetQuoteService } from '../services/quotes/GetQuoteService';
import { ListQuotesService } from '../services/quotes/ListQuotesService';

@Controller('quotes')
export class QuoteController {
	constructor(
		private readonly createQuoteService: CreateQuoteService,
		private readonly listQuotesService: ListQuotesService,
		private readonly getQuoteService: GetQuoteService,
		private readonly deleteQuoteService: DeleteQuoteService,
		private readonly listQuoteRevisionsService: ListQuoteRevisionsService,
	) {}

	@Post()
	createQuote(
		@Body(new JoiValidationPipe(updateQuoteBodySchema))
		body: IUpdateQuoteBody,
	): Promise<QuoteObject> {
		return this.createQuoteService.createQuote(body);
	}

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

	@Delete(':quoteId')
	deleteQuote(
		@Param('quoteId', ParseIntPipe) quoteId: number,
	): Promise<void> {
		return this.deleteQuoteService.deleteEntry(quoteId);
	}

	@Get(':quoteId/revisions')
	listQuoteRevisions(
		@Param('quoteId', ParseIntPipe) quoteId: number,
	): Promise<SearchResultObject<RevisionObject>> {
		return this.listQuoteRevisionsService.listEntryRevisions(quoteId);
	}
}
