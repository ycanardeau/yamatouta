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
import { GetPermissionContext } from '../decorators/GetPermissionContext';
import { SearchResultObject } from '../dto/SearchResultObject';
import { QuoteObject } from '../dto/quotes/QuoteObject';
import { RevisionObject } from '../dto/revisions/RevisionObject';
import { JoiValidationPipe } from '../pipes/JoiValidationPipe';
import { PermissionContext } from '../services/PermissionContext';

@Controller('quotes')
export class QuoteController {
	constructor(
		private readonly queryBus: QueryBus,
		private readonly commandBus: CommandBus,
	) {}

	@Post()
	createQuote(
		@GetPermissionContext() permissionContext: PermissionContext,
		@Body(new JoiValidationPipe(UpdateQuoteCommand.schema))
		command: UpdateQuoteCommand,
	): Promise<QuoteObject> {
		return this.commandBus.execute(
			new CreateQuoteCommand(
				permissionContext,
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
		@GetPermissionContext() permissionContext: PermissionContext,
		@Query(new JoiValidationPipe(ListQuotesQuery.schema))
		query: ListQuotesQuery,
	): Promise<SearchResultObject<QuoteObject>> {
		return this.queryBus.execute(
			new ListQuotesQuery(
				permissionContext,
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
		@GetPermissionContext() permissionContext: PermissionContext,
		@Param('quoteId', ParseIntPipe) quoteId: number,
	): Promise<QuoteObject> {
		return this.queryBus.execute(
			new GetQuoteQuery(permissionContext, quoteId),
		);
	}

	@Patch(':quoteId')
	updateQuote(
		@GetPermissionContext() permissionContext: PermissionContext,
		@Param('quoteId', ParseIntPipe) quoteId: number,
		@Body(new JoiValidationPipe(UpdateQuoteCommand.schema))
		command: UpdateQuoteCommand,
	): Promise<QuoteObject> {
		return this.commandBus.execute(
			new UpdateQuoteCommand(
				permissionContext,
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
		@GetPermissionContext() permissionContext: PermissionContext,
		@Param('quoteId', ParseIntPipe) quoteId: number,
	): Promise<void> {
		return this.commandBus.execute(
			new DeleteQuoteCommand(permissionContext, quoteId),
		);
	}

	@Get(':quoteId/revisions')
	listQuoteRevisions(
		@GetPermissionContext() permissionContext: PermissionContext,
		@Param('quoteId', ParseIntPipe) quoteId: number,
	): Promise<SearchResultObject<RevisionObject>> {
		return this.queryBus.execute(
			new ListQuoteRevisionsQuery(permissionContext, quoteId),
		);
	}
}
