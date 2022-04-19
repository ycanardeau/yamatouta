import { Controller, Get, Res } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Response } from 'express';

import { GenerateSitemapQuery } from '../database/queries/sitemap/GenerateSitemapQueryHandler';

@Controller('sitemap')
export class SitemapController {
	constructor(private readonly queryBus: QueryBus) {}

	@Get()
	async sitemap(@Res() response: Response): Promise<void> {
		// TODO: Cache.
		const xml = await this.queryBus.execute(new GenerateSitemapQuery());

		response.set('Content-Type', 'text/xml');
		response.send(xml);
	}
}
