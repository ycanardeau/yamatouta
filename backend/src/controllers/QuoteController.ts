import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	Query,
} from '@nestjs/common';

import { DeleteQuoteCommandHandler } from '../database/commands/entries/DeleteEntryCommandHandler';
import { CreateQuoteCommandHandler } from '../database/commands/quotes/CreateQuoteCommandHandler';
import {
	UpdateQuoteCommand,
	UpdateQuoteCommandHandler,
} from '../database/commands/quotes/UpdateQuoteCommandHandler';
import { ListQuoteRevisionsQueryHandler } from '../database/queries/entries/ListEntryRevisionsQueryHandler';
import { GetQuoteQueryHandler } from '../database/queries/quotes/GetQuoteQueryHandler';
import {
	ListQuotesQuery,
	ListQuotesQueryHandler,
} from '../database/queries/quotes/ListQuotesQueryHandler';
import { SearchResultObject } from '../dto/SearchResultObject';
import { QuoteObject } from '../dto/quotes/QuoteObject';
import { RevisionObject } from '../dto/revisions/RevisionObject';
import { JoiValidationPipe } from '../pipes/JoiValidationPipe';

@Controller('quotes')
export class QuoteController {
	constructor(
		private readonly createQuoteCommandHandler: CreateQuoteCommandHandler,
		private readonly listQuotesQueryHandler: ListQuotesQueryHandler,
		private readonly getQuoteQueryHandler: GetQuoteQueryHandler,
		private readonly updateQuoteCommandHandler: UpdateQuoteCommandHandler,
		private readonly deleteQuoteCommandHandler: DeleteQuoteCommandHandler,
		private readonly listQuoteRevisionsQueryHandler: ListQuoteRevisionsQueryHandler,
	) {}

	@Post()
	createQuote(
		@Body(new JoiValidationPipe(UpdateQuoteCommand.schema))
		command: UpdateQuoteCommand,
	): Promise<QuoteObject> {
		return this.createQuoteCommandHandler.execute(command);
	}

	@Get()
	listQuotes(
		@Query(new JoiValidationPipe(ListQuotesQuery.schema))
		query: ListQuotesQuery,
	): Promise<SearchResultObject<QuoteObject>> {
		return this.listQuotesQueryHandler.execute(query);
	}

	@Get(':quoteId')
	getQuote(
		@Param('quoteId', ParseIntPipe) quoteId: number,
	): Promise<QuoteObject> {
		return this.getQuoteQueryHandler.execute({ quoteId: quoteId });
	}

	@Patch(':quoteId')
	updateQuote(
		@Param('quoteId', ParseIntPipe) quoteId: number,
		@Body(new JoiValidationPipe(UpdateQuoteCommand.schema))
		command: UpdateQuoteCommand,
	): Promise<QuoteObject> {
		return this.updateQuoteCommandHandler.execute({
			...command,
			quoteId: quoteId,
		});
	}

	@Delete(':quoteId')
	deleteQuote(
		@Param('quoteId', ParseIntPipe) quoteId: number,
	): Promise<void> {
		return this.deleteQuoteCommandHandler.execute({ entryId: quoteId });
	}

	@Get(':quoteId/revisions')
	listQuoteRevisions(
		@Param('quoteId', ParseIntPipe) quoteId: number,
	): Promise<SearchResultObject<RevisionObject>> {
		return this.listQuoteRevisionsQueryHandler.execute({
			entryId: quoteId,
		});
	}
}
