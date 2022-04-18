import { Controller, Post } from '@nestjs/common';

import { CreateMissingRevisionsCommandHandler } from '../services/commands/admin/CreateMissingRevisionsCommandHandler';

@Controller('admin')
export class AdminController {
	constructor(
		private readonly createMissingRevisionsCommandHandler: CreateMissingRevisionsCommandHandler,
	) {}

	@Post('create-missing-revisions')
	createMissingRevisions(): Promise<void> {
		return this.createMissingRevisionsCommandHandler.execute();
	}
}
