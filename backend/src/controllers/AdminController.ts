import { Controller, Post, Req } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Request } from 'express';

import { CreateMissingRevisionsCommand } from '../database/commands/admin/CreateMissingRevisionsCommandHandler';
import { PermissionContext } from '../services/PermissionContext';

@Controller('admin')
export class AdminController {
	constructor(private readonly commandBus: CommandBus) {}

	@Post('create-missing-revisions')
	createMissingRevisions(@Req() request: Request): Promise<void> {
		return this.commandBus.execute(
			new CreateMissingRevisionsCommand(new PermissionContext(request)),
		);
	}
}
