import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

import { GenerateSitemapQueryHandler } from '../database/queries/sitemap/GenerateSitemapQueryHandler';

@Controller('sitemap')
export class SitemapController {
	constructor(
		private readonly generateSitemapQueryHandler: GenerateSitemapQueryHandler,
	) {}

	@Get()
	async sitemap(@Res() response: Response): Promise<void> {
		// TODO: Cache.
		const xml = await this.generateSitemapQueryHandler.execute();

		response.set('Content-Type', 'text/xml');
		response.send(xml);
	}
}
