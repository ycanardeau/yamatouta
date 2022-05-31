import { Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { AdminCreateMissingRevisionsCommand } from '../database/commands/admin/AdminCreateMissingRevisionsCommandHandler';
import { GetPermissionContext } from '../framework/decorators/GetPermissionContext';
import { PermissionContext } from '../services/PermissionContext';

@Controller('admin')
export class AdminController {
	constructor(private readonly commandBus: CommandBus) {}

	@Post('create-missing-revisions')
	createMissingRevisions(
		@GetPermissionContext() permissionContext: PermissionContext,
	): Promise<void> {
		return this.commandBus.execute(
			new AdminCreateMissingRevisionsCommand(permissionContext),
		);
	}
}
