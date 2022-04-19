import { Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { CreateMissingRevisionsCommand } from '../database/commands/admin/CreateMissingRevisionsCommandHandler';
import { GetPermissionContext } from '../decorators/GetPermissionContext';
import { PermissionContext } from '../services/PermissionContext';

@Controller('admin')
export class AdminController {
	constructor(private readonly commandBus: CommandBus) {}

	@Post('create-missing-revisions')
	createMissingRevisions(
		@GetPermissionContext() permissionContext: PermissionContext,
	): Promise<void> {
		return this.commandBus.execute(
			new CreateMissingRevisionsCommand(permissionContext),
		);
	}
}
