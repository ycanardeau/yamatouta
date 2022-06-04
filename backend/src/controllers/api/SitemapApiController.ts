import { Controller, Get, Res } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Response } from 'express';

import { SitemapGenerateQuery } from '../../database/queries/sitemap/SitemapGenerateQueryHandler';

@Controller('api/sitemap')
export class SitemapApiController {
	constructor(private readonly queryBus: QueryBus) {}

	@Get('generate')
	async sitemap(@Res() response: Response): Promise<void> {
		// TODO: Cache.
		const xml = await this.queryBus.execute(new SitemapGenerateQuery());

		response.set('Content-Type', 'text/xml');
		response.send(xml);
	}
}
