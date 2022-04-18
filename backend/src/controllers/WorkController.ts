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
import {
	IUpdateWorkBody,
	updateWorkBodySchema,
} from '../requests/works/IUpdateWorkBody';
import { DeleteWorkService } from '../services/entries/DeleteEntryService';
import { ListWorkRevisionsService } from '../services/entries/ListEntryRevisionsService';
import { CreateWorkService } from '../services/works/CreateWorkService';
import { GetWorkService } from '../services/works/GetWorkService';
import { ListWorksService } from '../services/works/ListWorksService';
import { UpdateWorkService } from '../services/works/UpdateWorkService';

@Controller('works')
export class WorkController {
	constructor(
		private readonly createWorkService: CreateWorkService,
		private readonly listWorksService: ListWorksService,
		private readonly getWorkService: GetWorkService,
		private readonly updateWorkService: UpdateWorkService,
		private readonly deleteWorkService: DeleteWorkService,
		private readonly listWorkRevisionsService: ListWorkRevisionsService,
	) {}

	@Post()
	createWork(
		@Body(new JoiValidationPipe(updateWorkBodySchema))
		body: IUpdateWorkBody,
	): Promise<WorkObject> {
		return this.createWorkService.execute(body);
	}

	@Get()
	listWorks(
		@Query(new JoiValidationPipe(listWorksQuerySchema))
		query: IListWorksQuery,
	): Promise<SearchResultObject<WorkObject>> {
		return this.listWorksService.execute(query);
	}

	@Get(':workId')
	getWork(
		@Param('workId', ParseIntPipe) workId: number,
	): Promise<WorkObject> {
		return this.getWorkService.execute(workId);
	}

	@Patch(':workId')
	updateWork(
		@Param('workId', ParseIntPipe) workId: number,
		@Body(new JoiValidationPipe(updateWorkBodySchema))
		body: IUpdateWorkBody,
	): Promise<WorkObject> {
		return this.updateWorkService.execute(workId, body);
	}

	@Delete(':workId')
	deleteWork(@Param('workId', ParseIntPipe) workId: number): Promise<void> {
		return this.deleteWorkService.execute(workId);
	}

	@Get(':workId/revisions')
	listWorkRevisions(
		@Param('workId', ParseIntPipe) workId: number,
	): Promise<SearchResultObject<RevisionObject>> {
		return this.listWorkRevisionsService.execute(workId);
	}
}
