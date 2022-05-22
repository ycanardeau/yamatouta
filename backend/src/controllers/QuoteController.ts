import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import {
	EntryDeleteParams,
	QuoteDeleteCommand,
} from '../database/commands/entries/EntryDeleteCommandHandler';
import {
	QuoteUpdateCommand,
	QuoteUpdateParams,
} from '../database/commands/quotes/QuoteUpdateCommandHandler';
import {
	EntryListRevisionsParams,
	QuoteListRevisionsQuery,
} from '../database/queries/entries/EntryListRevisionsQueryHandler';
import {
	QuoteGetParams,
	QuoteGetQuery,
} from '../database/queries/quotes/QuoteGetQueryHandler';
import {
	QuoteListParams,
	QuoteListQuery,
} from '../database/queries/quotes/QuoteListQueryHandler';
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

	@Post('create')
	create(
		@GetPermissionContext() permissionContext: PermissionContext,
		@Body(new JoiValidationPipe(QuoteUpdateParams.schema))
		params: QuoteUpdateParams,
	): Promise<QuoteObject> {
		return this.commandBus.execute(
			new QuoteUpdateCommand(permissionContext, params),
		);
	}

	@Delete('delete')
	delete(
		@GetPermissionContext() permissionContext: PermissionContext,
		@Body(new JoiValidationPipe(EntryDeleteParams.schema))
		params: EntryDeleteParams,
	): Promise<void> {
		return this.commandBus.execute(
			new QuoteDeleteCommand(permissionContext, params),
		);
	}

	@Get('get')
	get(
		@GetPermissionContext() permissionContext: PermissionContext,
		@Query(new JoiValidationPipe(QuoteGetParams.schema))
		params: QuoteGetParams,
	): Promise<QuoteObject> {
		return this.queryBus.execute(
			new QuoteGetQuery(permissionContext, params),
		);
	}

	@Get('list')
	list(
		@GetPermissionContext() permissionContext: PermissionContext,
		@Query(new JoiValidationPipe(QuoteListParams.schema))
		params: QuoteListParams,
	): Promise<SearchResultObject<QuoteObject>> {
		return this.queryBus.execute(
			new QuoteListQuery(permissionContext, params),
		);
	}

	@Get('list-revisions')
	listRevisions(
		@GetPermissionContext() permissionContext: PermissionContext,
		@Query(new JoiValidationPipe(EntryListRevisionsParams.schema))
		params: EntryListRevisionsParams,
	): Promise<SearchResultObject<RevisionObject>> {
		return this.queryBus.execute(
			new QuoteListRevisionsQuery(permissionContext, params),
		);
	}

	@Post('update')
	update(
		@GetPermissionContext() permissionContext: PermissionContext,
		@Body(new JoiValidationPipe(QuoteUpdateParams.schema))
		params: QuoteUpdateParams,
	): Promise<QuoteObject> {
		return this.commandBus.execute(
			new QuoteUpdateCommand(permissionContext, params),
		);
	}
}
