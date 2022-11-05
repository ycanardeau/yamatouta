import { WorkDeleteCommand } from '@/database/commands/EntryDeleteCommandHandler';
import { WorkUpdateCommand } from '@/database/commands/works/WorkUpdateCommandHandler';
import { WorkListRevisionsQuery } from '@/database/queries/EntryListRevisionsQueryHandler';
import { WorkGetQuery } from '@/database/queries/works/WorkGetQueryHandler';
import { WorkListQuery } from '@/database/queries/works/WorkListQueryHandler';
import { RevisionDto } from '@/dto/RevisionDto';
import { SearchResultDto } from '@/dto/SearchResultDto';
import { WorkDto } from '@/dto/WorkDto';
import { GetPermissionContext } from '@/framework/decorators/GetPermissionContext';
import { JoiValidationPipe } from '@/framework/pipes/JoiValidationPipe';
import { EntryDeleteParams } from '@/models/EntryDeleteParams';
import { EntryListRevisionsParams } from '@/models/EntryListRevisionsParams';
import { WorkGetParams } from '@/models/works/WorkGetParams';
import { WorkListParams } from '@/models/works/WorkListParams';
import { WorkUpdateParams } from '@/models/works/WorkUpdateParams';
import { PermissionContext } from '@/services/PermissionContext';
import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

@Controller('api/works')
export class WorkApiController {
	constructor(
		private readonly queryBus: QueryBus,
		private readonly commandBus: CommandBus,
	) {}

	@Post('create')
	create(
		@GetPermissionContext() permissionContext: PermissionContext,
		@Body(new JoiValidationPipe(WorkUpdateParams.schema))
		params: WorkUpdateParams,
	): Promise<WorkDto> {
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
	): Promise<WorkDto> {
		return this.queryBus.execute(
			new WorkGetQuery(permissionContext, params),
		);
	}

	@Get('list')
	list(
		@GetPermissionContext() permissionContext: PermissionContext,
		@Query(new JoiValidationPipe(WorkListParams.schema))
		params: WorkListParams,
	): Promise<SearchResultDto<WorkDto>> {
		return this.queryBus.execute(
			new WorkListQuery(permissionContext, params),
		);
	}

	@Get('list-revisions')
	listRevisions(
		@GetPermissionContext() permissionContext: PermissionContext,
		@Query(new JoiValidationPipe(EntryListRevisionsParams.schema))
		params: EntryListRevisionsParams,
	): Promise<SearchResultDto<RevisionDto>> {
		return this.queryBus.execute(
			new WorkListRevisionsQuery(permissionContext, params),
		);
	}

	@Post('update')
	update(
		@GetPermissionContext() permissionContext: PermissionContext,
		@Body(new JoiValidationPipe(WorkUpdateParams.schema))
		params: WorkUpdateParams,
	): Promise<WorkDto> {
		return this.commandBus.execute(
			new WorkUpdateCommand(permissionContext, params),
		);
	}
}
