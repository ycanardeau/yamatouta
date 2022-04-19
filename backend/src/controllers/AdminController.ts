import { Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { CreateMissingRevisionsCommand } from '../database/commands/admin/CreateMissingRevisionsCommandHandler';

@Controller('admin')
export class AdminController {
	constructor(private readonly commandBus: CommandBus) {}

	@Post('create-missing-revisions')
	createMissingRevisions(): Promise<void> {
		return this.commandBus.execute(new CreateMissingRevisionsCommand());
	}
}
