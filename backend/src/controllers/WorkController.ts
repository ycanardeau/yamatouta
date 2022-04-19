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
import { UpdateWorkCommand } from '../database/commands/works/UpdateWorkCommandHandler';
import { ListWorkRevisionsQuery } from '../database/queries/entries/ListEntryRevisionsQueryHandler';
import { GetWorkQuery } from '../database/queries/works/GetWorkQueryHandler';
import { ListWorksQuery } from '../database/queries/works/ListWorksQueryHandler';
import { SearchResultObject } from '../dto/SearchResultObject';
import { RevisionObject } from '../dto/revisions/RevisionObject';
import { WorkObject } from '../dto/works/WorkObject';
import { JoiValidationPipe } from '../pipes/JoiValidationPipe';

@Controller('works')
export class WorkController {
	constructor(
		private readonly queryBus: QueryBus,
		private readonly commandBus: CommandBus,
	) {}

	@Post()
	createWork(
		@Body(new JoiValidationPipe(UpdateWorkCommand.schema))
		command: UpdateWorkCommand,
	): Promise<WorkObject> {
		return this.commandBus.execute(
			new CreateWorkCommand(
				command.workId,
				command.name,
				command.workType,
			),
		);
	}

	@Get()
	listWorks(
		@Query(new JoiValidationPipe(ListWorksQuery.schema))
		query: ListWorksQuery,
	): Promise<SearchResultObject<WorkObject>> {
		return this.queryBus.execute(
			new ListWorksQuery(
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
		@Param('workId', ParseIntPipe) workId: number,
	): Promise<WorkObject> {
		return this.queryBus.execute(new GetWorkQuery(workId));
	}

	@Patch(':workId')
	updateWork(
		@Param('workId', ParseIntPipe) workId: number,
		@Body(new JoiValidationPipe(UpdateWorkCommand.schema))
		command: UpdateWorkCommand,
	): Promise<WorkObject> {
		return this.commandBus.execute(
			new UpdateWorkCommand(workId, command.name, command.workType),
		);
	}

	@Delete(':workId')
	deleteWork(@Param('workId', ParseIntPipe) workId: number): Promise<void> {
		return this.commandBus.execute(new DeleteWorkCommand(workId));
	}

	@Get(':workId/revisions')
	listWorkRevisions(
		@Param('workId', ParseIntPipe) workId: number,
	): Promise<SearchResultObject<RevisionObject>> {
		return this.queryBus.execute(new ListWorkRevisionsQuery(workId));
	}
}
