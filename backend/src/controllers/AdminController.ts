import { Controller, Post } from '@nestjs/common';

import { CreateMissingRevisionsService } from '../services/admin/CreateMissingRevisionsService';

@Controller('admin')
export class AdminController {
	constructor(
		private readonly createMissingRevisionsService: CreateMissingRevisionsService,
	) {}

	@Post('create-missing-revisions')
	createMissingRevisions(): Promise<void> {
		return this.createMissingRevisionsService.createMissingRevisions();
	}
}
