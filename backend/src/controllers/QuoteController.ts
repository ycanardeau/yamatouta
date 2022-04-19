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
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { DeleteQuoteCommand } from '../database/commands/entries/DeleteEntryCommandHandler';
import { CreateQuoteCommand } from '../database/commands/quotes/CreateQuoteCommandHandler';
import { UpdateQuoteCommand } from '../database/commands/quotes/UpdateQuoteCommandHandler';
import { ListQuoteRevisionsQuery } from '../database/queries/entries/ListEntryRevisionsQueryHandler';
import { GetQuoteQuery } from '../database/queries/quotes/GetQuoteQueryHandler';
import { ListQuotesQuery } from '../database/queries/quotes/ListQuotesQueryHandler';
import { SearchResultObject } from '../dto/SearchResultObject';
import { QuoteObject } from '../dto/quotes/QuoteObject';
import { RevisionObject } from '../dto/revisions/RevisionObject';
import { JoiValidationPipe } from '../pipes/JoiValidationPipe';

@Controller('quotes')
export class QuoteController {
	constructor(
		private readonly queryBus: QueryBus,
		private readonly commandBus: CommandBus,
	) {}

	@Post()
	createQuote(
		@Body(new JoiValidationPipe(UpdateQuoteCommand.schema))
		command: UpdateQuoteCommand,
	): Promise<QuoteObject> {
		return this.commandBus.execute(
			new CreateQuoteCommand(
				command.quoteId,
				command.text,
				command.quoteType,
				command.locale,
				command.artistId,
			),
		);
	}

	@Get()
	listQuotes(
		@Query(new JoiValidationPipe(ListQuotesQuery.schema))
		query: ListQuotesQuery,
	): Promise<SearchResultObject<QuoteObject>> {
		return this.queryBus.execute(
			new ListQuotesQuery(
				query.quoteType,
				query.sort,
				query.offset,
				query.limit,
				query.getTotalCount,
				query.artistId,
			),
		);
	}

	@Get(':quoteId')
	getQuote(
		@Param('quoteId', ParseIntPipe) quoteId: number,
	): Promise<QuoteObject> {
		return this.queryBus.execute(new GetQuoteQuery(quoteId));
	}

	@Patch(':quoteId')
	updateQuote(
		@Param('quoteId', ParseIntPipe) quoteId: number,
		@Body(new JoiValidationPipe(UpdateQuoteCommand.schema))
		command: UpdateQuoteCommand,
	): Promise<QuoteObject> {
		return this.commandBus.execute(
			new UpdateQuoteCommand(
				quoteId,
				command.text,
				command.quoteType,
				command.locale,
				command.artistId,
			),
		);
	}

	@Delete(':quoteId')
	deleteQuote(
		@Param('quoteId', ParseIntPipe) quoteId: number,
	): Promise<void> {
		return this.commandBus.execute(new DeleteQuoteCommand(quoteId));
	}

	@Get(':quoteId/revisions')
	listQuoteRevisions(
		@Param('quoteId', ParseIntPipe) quoteId: number,
	): Promise<SearchResultObject<RevisionObject>> {
		return this.queryBus.execute(new ListQuoteRevisionsQuery(quoteId));
	}
}
