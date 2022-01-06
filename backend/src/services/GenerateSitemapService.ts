import { Injectable } from '@nestjs/common';
import { SitemapStream, streamToPromise } from 'sitemap';

import { ListArtistIdsService } from './artists/ListArtistIdsService';
import { ListQuoteIdsService } from './quotes/ListQuoteIdsService';

@Injectable()
export class GenerateSitemapService {
	constructor(
		private readonly listArtistIdsService: ListArtistIdsService,
		private readonly listQuoteIdsService: ListQuoteIdsService,
	) {}

	async generateSitemap(): Promise<Buffer> {
		const [artistIds, quoteIds] = await Promise.all([
			this.listArtistIdsService.listArtistIds(),
			this.listQuoteIdsService.listQuoteIds(),
		]);

		const sitemapStream = new SitemapStream({
			hostname: 'https://yamatouta.net',
		});

		for (const artistId of artistIds)
			sitemapStream.write({ url: `/artists/${artistId}` });

		for (const quoteId of quoteIds)
			sitemapStream.write({ url: `/quotes/${quoteId}` });

		sitemapStream.end();

		return streamToPromise(sitemapStream);
	}
}
