import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import {
	EntryDeleteParams,
	WorkDeleteCommand,
} from '../database/commands/entries/EntryDeleteCommandHandler';
import {
	WorkUpdateCommand,
	WorkUpdateParams,
} from '../database/commands/works/WorkUpdateCommandHandler';
import {
	EntryListRevisionsParams,
	WorkListRevisionsQuery,
} from '../database/queries/entries/EntryListRevisionsQueryHandler';
import {
	WorkGetParams,
	WorkGetQuery,
} from '../database/queries/works/WorkGetQueryHandler';
import {
	WorkListParams,
	WorkListQuery,
} from '../database/queries/works/WorkListQueryHandler';
import { GetPermissionContext } from '../decorators/GetPermissionContext';
import { RevisionObject } from '../dto/RevisionObject';
import { SearchResultObject } from '../dto/SearchResultObject';
import { WorkObject } from '../dto/WorkObject';
import { JoiValidationPipe } from '../pipes/JoiValidationPipe';
import { PermissionContext } from '../services/PermissionContext';

@Controller('works')
export class WorkController {
	constructor(
		private readonly queryBus: QueryBus,
		private readonly commandBus: CommandBus,
	) {}

	@Post('create')
	create(
		@GetPermissionContext() permissionContext: PermissionContext,
		@Body(new JoiValidationPipe(WorkUpdateParams.schema))
		params: WorkUpdateParams,
	): Promise<WorkObject> {
		return this.commandBus.execute(
			new WorkUpdateCommand(permissionContext, params),
		);
	}

	@Delete('delete')
	delete(
		@GetPermissionContext() permissionContext: PermissionContext,
		@Body(new JoiValidationPipe(EntryDeleteParams.schema))
		params: EntryDeleteParams,
	): Promise<void> {
		return this.commandBus.execute(
			new WorkDeleteCommand(permissionContext, params),
		);
	}

	@Get('get')
	get(
		@GetPermissionContext() permissionContext: PermissionContext,
		@Query(new JoiValidationPipe(WorkGetParams.schema))
		params: WorkGetParams,
	): Promise<WorkObject> {
		return this.queryBus.execute(
			new WorkGetQuery(permissionContext, params),
		);
	}

	@Get('list')
	list(
		@GetPermissionContext() permissionContext: PermissionContext,
		@Query(new JoiValidationPipe(WorkListParams.schema))
		params: WorkListParams,
	): Promise<SearchResultObject<WorkObject>> {
		return this.queryBus.execute(
			new WorkListQuery(permissionContext, params),
		);
	}

	@Get('list-revisions')
	listRevisions(
		@GetPermissionContext() permissionContext: PermissionContext,
		@Query(new JoiValidationPipe(EntryListRevisionsParams.schema))
		params: EntryListRevisionsParams,
	): Promise<SearchResultObject<RevisionObject>> {
		return this.queryBus.execute(
			new WorkListRevisionsQuery(permissionContext, params),
		);
	}

	@Post('update')
	update(
		@GetPermissionContext() permissionContext: PermissionContext,
		@Body(new JoiValidationPipe(WorkUpdateParams.schema))
		params: WorkUpdateParams,
	): Promise<WorkObject> {
		return this.commandBus.execute(
			new WorkUpdateCommand(permissionContext, params),
		);
	}
}
