import { Body, Controller, Post, Res } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Response } from 'express';

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
	async sitemap(
		@GetPermissionContext() permissionContext: PermissionContext,
		@Res() response: Response,
	): Promise<void> {
		const xml = await this.sitemapService.generate(permissionContext);

		response.set('Content-Type', 'text/xml');
		response.send(xml);
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
