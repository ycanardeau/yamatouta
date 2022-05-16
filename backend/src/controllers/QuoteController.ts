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
import {
	UpdateQuoteCommand,
	UpdateQuoteParams,
} from '../database/commands/quotes/UpdateQuoteCommandHandler';
import { ListQuoteRevisionsQuery } from '../database/queries/entries/ListEntryRevisionsQueryHandler';
import {
	GetQuoteParams,
	GetQuoteQuery,
} from '../database/queries/quotes/GetQuoteQueryHandler';
import {
	ListQuotesParams,
	ListQuotesQuery,
} from '../database/queries/quotes/ListQuotesQueryHandler';
import { GetPermissionContext } from '../decorators/GetPermissionContext';
import { QuoteObject } from '../dto/QuoteObject';
import { RevisionObject } from '../dto/RevisionObject';
import { SearchResultObject } from '../dto/SearchResultObject';
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
		@Body(new JoiValidationPipe(UpdateQuoteParams.schema))
		params: UpdateQuoteParams,
	): Promise<QuoteObject> {
		return this.commandBus.execute(
			new CreateQuoteCommand(permissionContext, params),
		);
	}

	@Get()
	listQuotes(
		@GetPermissionContext() permissionContext: PermissionContext,
		@Query(new JoiValidationPipe(ListQuotesParams.schema))
		params: ListQuotesParams,
	): Promise<SearchResultObject<QuoteObject>> {
		return this.queryBus.execute(
			new ListQuotesQuery(permissionContext, params),
		);
	}

	@Get(':quoteId')
	getQuote(
		@GetPermissionContext() permissionContext: PermissionContext,
		@Param('quoteId', ParseIntPipe) quoteId: number,
		@Query(new JoiValidationPipe(GetQuoteParams.schema))
		params: GetQuoteParams,
	): Promise<QuoteObject> {
		return this.queryBus.execute(
			new GetQuoteQuery(permissionContext, { ...params, quoteId }),
		);
	}

	@Patch(':quoteId')
	updateQuote(
		@GetPermissionContext() permissionContext: PermissionContext,
		@Param('quoteId', ParseIntPipe) quoteId: number,
		@Body(new JoiValidationPipe(UpdateQuoteParams.schema))
		params: UpdateQuoteParams,
	): Promise<QuoteObject> {
		return this.commandBus.execute(
			new UpdateQuoteCommand(permissionContext, { ...params, quoteId }),
		);
	}

	@Delete(':quoteId')
	deleteQuote(
		@GetPermissionContext() permissionContext: PermissionContext,
		@Param('quoteId', ParseIntPipe) quoteId: number,
	): Promise<void> {
		return this.commandBus.execute(
			new DeleteQuoteCommand(permissionContext, { entryId: quoteId }),
		);
	}

	@Get(':quoteId/revisions')
	listQuoteRevisions(
		@GetPermissionContext() permissionContext: PermissionContext,
		@Param('quoteId', ParseIntPipe) quoteId: number,
	): Promise<SearchResultObject<RevisionObject>> {
		return this.queryBus.execute(
			new ListQuoteRevisionsQuery(permissionContext, {
				entryId: quoteId,
			}),
		);
	}
}
