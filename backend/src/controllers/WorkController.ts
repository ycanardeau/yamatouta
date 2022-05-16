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

import { DeleteWorkCommand } from '../database/commands/entries/DeleteEntryCommandHandler';
import { CreateWorkCommand } from '../database/commands/works/CreateWorkCommandHandler';
import {
	UpdateWorkCommand,
	UpdateWorkParams,
} from '../database/commands/works/UpdateWorkCommandHandler';
import { ListWorkRevisionsQuery } from '../database/queries/entries/ListEntryRevisionsQueryHandler';
import {
	GetWorkParams,
	GetWorkQuery,
} from '../database/queries/works/GetWorkQueryHandler';
import {
	ListWorksParams,
	ListWorksQuery,
} from '../database/queries/works/ListWorksQueryHandler';
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

	@Post()
	createWork(
		@GetPermissionContext() permissionContext: PermissionContext,
		@Body(new JoiValidationPipe(UpdateWorkParams.schema))
		params: UpdateWorkParams,
	): Promise<WorkObject> {
		return this.commandBus.execute(
			new CreateWorkCommand(permissionContext, params),
		);
	}

	@Get()
	listWorks(
		@GetPermissionContext() permissionContext: PermissionContext,
		@Query(new JoiValidationPipe(ListWorksParams.schema))
		params: ListWorksParams,
	): Promise<SearchResultObject<WorkObject>> {
		return this.queryBus.execute(
			new ListWorksQuery(permissionContext, params),
		);
	}

	@Get(':workId')
	getWork(
		@GetPermissionContext() permissionContext: PermissionContext,
		@Param('workId', ParseIntPipe) workId: number,
		@Query(new JoiValidationPipe(GetWorkParams.schema))
		params: GetWorkParams,
	): Promise<WorkObject> {
		return this.queryBus.execute(
			new GetWorkQuery(permissionContext, { ...params, workId }),
		);
	}

	@Patch(':workId')
	updateWork(
		@GetPermissionContext() permissionContext: PermissionContext,
		@Param('workId', ParseIntPipe) workId: number,
		@Body(new JoiValidationPipe(UpdateWorkParams.schema))
		params: UpdateWorkParams,
	): Promise<WorkObject> {
		return this.commandBus.execute(
			new UpdateWorkCommand(permissionContext, { ...params, workId }),
		);
	}

	@Delete(':workId')
	deleteWork(
		@GetPermissionContext() permissionContext: PermissionContext,
		@Param('workId', ParseIntPipe) workId: number,
	): Promise<void> {
		return this.commandBus.execute(
			new DeleteWorkCommand(permissionContext, { entryId: workId }),
		);
	}

	@Get(':workId/revisions')
	listWorkRevisions(
		@GetPermissionContext() permissionContext: PermissionContext,
		@Param('workId', ParseIntPipe) workId: number,
	): Promise<SearchResultObject<RevisionObject>> {
		return this.queryBus.execute(
			new ListWorkRevisionsQuery(permissionContext, { entryId: workId }),
		);
	}
}
