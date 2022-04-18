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

import { SearchResultObject } from '../dto/SearchResultObject';
import { RevisionObject } from '../dto/revisions/RevisionObject';
import { WorkObject } from '../dto/works/WorkObject';
import { JoiValidationPipe } from '../pipes/JoiValidationPipe';
import {
	IListWorksQuery,
	listWorksQuerySchema,
} from '../requests/works/IListWorksQuery';
import { DeleteWorkCommandHandler } from '../services/commands/entries/DeleteEntryCommandHandler';
import { CreateWorkCommandHandler } from '../services/commands/works/CreateWorkCommandHandler';
import {
	UpdateWorkCommand,
	UpdateWorkCommandHandler,
} from '../services/commands/works/UpdateWorkCommandHandler';
import { ListWorkRevisionsQueryHandler } from '../services/queries/entries/ListEntryRevisionsQueryHandler';
import { GetWorkQueryHandler } from '../services/queries/works/GetWorkQueryHandler';
import { ListWorksQueryHandler } from '../services/queries/works/ListWorksQueryHandler';

@Controller('works')
export class WorkController {
	constructor(
		private readonly createWorkCommandHandler: CreateWorkCommandHandler,
		private readonly listWorksQueryHandler: ListWorksQueryHandler,
		private readonly getWorkQueryHandler: GetWorkQueryHandler,
		private readonly updateWorkCommandHandler: UpdateWorkCommandHandler,
		private readonly deleteWorkCommandHandler: DeleteWorkCommandHandler,
		private readonly listWorkRevisionsQueryHandler: ListWorkRevisionsQueryHandler,
	) {}

	@Post()
	createWork(
		@Body(new JoiValidationPipe(UpdateWorkCommand.schema))
		command: UpdateWorkCommand,
	): Promise<WorkObject> {
		return this.createWorkCommandHandler.execute(command);
	}

	@Get()
	listWorks(
		@Query(new JoiValidationPipe(listWorksQuerySchema))
		query: IListWorksQuery,
	): Promise<SearchResultObject<WorkObject>> {
		return this.listWorksQueryHandler.execute(query);
	}

	@Get(':workId')
	getWork(
		@Param('workId', ParseIntPipe) workId: number,
	): Promise<WorkObject> {
		return this.getWorkQueryHandler.execute(workId);
	}

	@Patch(':workId')
	updateWork(
		@Param('workId', ParseIntPipe) workId: number,
		@Body(new JoiValidationPipe(UpdateWorkCommand.schema))
		command: UpdateWorkCommand,
	): Promise<WorkObject> {
		return this.updateWorkCommandHandler.execute({
			...command,
			workId: workId,
		});
	}

	@Delete(':workId')
	deleteWork(@Param('workId', ParseIntPipe) workId: number): Promise<void> {
		return this.deleteWorkCommandHandler.execute({ entryId: workId });
	}

	@Get(':workId/revisions')
	listWorkRevisions(
		@Param('workId', ParseIntPipe) workId: number,
	): Promise<SearchResultObject<RevisionObject>> {
		return this.listWorkRevisionsQueryHandler.execute(workId);
	}
}
