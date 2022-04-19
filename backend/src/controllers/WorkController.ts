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
	Req,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Request } from 'express';

import { DeleteWorkCommand } from '../database/commands/entries/DeleteEntryCommandHandler';
import { CreateWorkCommand } from '../database/commands/works/CreateWorkCommandHandler';
import { UpdateWorkCommand } from '../database/commands/works/UpdateWorkCommandHandler';
import { ListWorkRevisionsQuery } from '../database/queries/entries/ListEntryRevisionsQueryHandler';
import { GetWorkQuery } from '../database/queries/works/GetWorkQueryHandler';
import { ListWorksQuery } from '../database/queries/works/ListWorksQueryHandler';
import { SearchResultObject } from '../dto/SearchResultObject';
import { RevisionObject } from '../dto/revisions/RevisionObject';
import { WorkObject } from '../dto/works/WorkObject';
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
		@Req() request: Request,
		@Body(new JoiValidationPipe(UpdateWorkCommand.schema))
		command: UpdateWorkCommand,
	): Promise<WorkObject> {
		return this.commandBus.execute(
			new CreateWorkCommand(
				new PermissionContext(request),
				command.workId,
				command.name,
				command.workType,
			),
		);
	}

	@Get()
	listWorks(
		@Req() request: Request,
		@Query(new JoiValidationPipe(ListWorksQuery.schema))
		query: ListWorksQuery,
	): Promise<SearchResultObject<WorkObject>> {
		return this.queryBus.execute(
			new ListWorksQuery(
				new PermissionContext(request),
				query.workType,
				query.sort,
				query.offset,
				query.limit,
				query.getTotalCount,
				query.query,
			),
		);
	}

	@Get(':workId')
	getWork(
		@Req() request: Request,
		@Param('workId', ParseIntPipe) workId: number,
	): Promise<WorkObject> {
		return this.queryBus.execute(
			new GetWorkQuery(new PermissionContext(request), workId),
		);
	}

	@Patch(':workId')
	updateWork(
		@Req() request: Request,
		@Param('workId', ParseIntPipe) workId: number,
		@Body(new JoiValidationPipe(UpdateWorkCommand.schema))
		command: UpdateWorkCommand,
	): Promise<WorkObject> {
		return this.commandBus.execute(
			new UpdateWorkCommand(
				new PermissionContext(request),
				workId,
				command.name,
				command.workType,
			),
		);
	}

	@Delete(':workId')
	deleteWork(
		@Req() request: Request,
		@Param('workId', ParseIntPipe) workId: number,
	): Promise<void> {
		return this.commandBus.execute(
			new DeleteWorkCommand(new PermissionContext(request), workId),
		);
	}

	@Get(':workId/revisions')
	listWorkRevisions(
		@Req() request: Request,
		@Param('workId', ParseIntPipe) workId: number,
	): Promise<SearchResultObject<RevisionObject>> {
		return this.queryBus.execute(
			new ListWorkRevisionsQuery(new PermissionContext(request), workId),
		);
	}
}
