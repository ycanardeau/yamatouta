import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

import { GenerateSitemapService } from '../services/GenerateSitemapService';

@Controller('sitemap')
export class SitemapController {
	constructor(
		private readonly generateSitemapService: GenerateSitemapService,
	) {}

	@Get()
	async sitemap(@Res() response: Response): Promise<void> {
		// TODO: Cache.
		const xml = await this.generateSitemapService.execute();

		response.set('Content-Type', 'text/xml');
		response.send(xml);
	}
}
