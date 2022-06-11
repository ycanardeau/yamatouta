import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

import { AdminCreateMissingRevisionsCommand } from '../../database/commands/admin/AdminCreateMissingRevisionsCommandHandler';
import { AdminUpdateSearchIndexCommand } from '../../database/commands/admin/AdminUpdateSearchIndexCommandHandler';
import { GetPermissionContext } from '../../framework/decorators/GetPermissionContext';
import { JoiValidationPipe } from '../../framework/pipes/JoiValidationPipe';
import { AdminUpdateSearchIndexParams } from '../../models/admin/AdminUpdateSearchIndexParams';
import { PermissionContext } from '../../services/PermissionContext';
import { SitemapService } from '../../services/SitemapService';

@Controller('api/admin')
export class AdminApiController {
	constructor(
		private readonly commandBus: CommandBus,
		private readonly sitemapService: SitemapService,
	) {}

	@Post('create-missing-revisions')
	createMissingRevisions(
		@GetPermissionContext() permissionContext: PermissionContext,
	): Promise<void> {
		return this.commandBus.execute(
			new AdminCreateMissingRevisionsCommand(permissionContext),
		);
	}

	@Post('generate-sitemaps')
	sitemap(
		@GetPermissionContext() permissionContext: PermissionContext,
	): Promise<void> {
		return this.sitemapService.generate(permissionContext);
	}

	@Post('update-search-index')
	updateSearchIndex(
		@GetPermissionContext() permissionContext: PermissionContext,
		@Body(new JoiValidationPipe(AdminUpdateSearchIndexParams.schema))
		params: AdminUpdateSearchIndexParams,
	): Promise<void> {
		return this.commandBus.execute(
			new AdminUpdateSearchIndexCommand(permissionContext, params),
		);
	}
}
