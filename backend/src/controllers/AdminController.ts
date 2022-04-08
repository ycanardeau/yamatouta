import { Controller, Post } from '@nestjs/common';

import { CreateRevisionsService } from '../services/admin/CreateRevisionsService';

@Controller('admin')
export class AdminController {
	constructor(
		private readonly createRevisionsService: CreateRevisionsService,
	) {}

	@Post('create-revisions')
	createRevisions(): Promise<void> {
		return this.createRevisionsService.createRevisions();
	}
}
