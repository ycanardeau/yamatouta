import { QuoteDeleteCommand } from '@/database/commands/EntryDeleteCommandHandler';
import { QuoteUpdateCommand } from '@/database/commands/quotes/QuoteUpdateCommandHandler';
import { QuoteListRevisionsQuery } from '@/database/queries/EntryListRevisionsQueryHandler';
import { QuoteGetQuery } from '@/database/queries/quotes/QuoteGetQueryHandler';
import { QuoteListQuery } from '@/database/queries/quotes/QuoteListQueryHandler';
import { QuoteObject } from '@/dto/QuoteObject';
import { RevisionObject } from '@/dto/RevisionObject';
import { SearchResultObject } from '@/dto/SearchResultObject';
import { GetPermissionContext } from '@/framework/decorators/GetPermissionContext';
import { JoiValidationPipe } from '@/framework/pipes/JoiValidationPipe';
import { EntryDeleteParams } from '@/models/EntryDeleteParams';
import { EntryListRevisionsParams } from '@/models/EntryListRevisionsParams';
import { QuoteGetParams } from '@/models/quotes/QuoteGetParams';
import { QuoteListParams } from '@/models/quotes/QuoteListParams';
import { QuoteUpdateParams } from '@/models/quotes/QuoteUpdateParams';
import { PermissionContext } from '@/services/PermissionContext';
import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

@Controller('api/quotes')
export class QuoteApiController {
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
