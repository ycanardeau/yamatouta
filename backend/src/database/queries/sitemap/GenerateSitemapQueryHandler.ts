import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SitemapStream, streamToPromise } from 'sitemap';

import { ListArtistIdsQueryHandler } from '../artists/ListArtistIdsQueryHandler';
import { ListQuoteIdsQueryHandler } from '../quotes/ListQuoteIdsQueryHandler';

export class GenerateSitemapQuery {}

@QueryHandler(GenerateSitemapQuery)
export class GenerateSitemapQueryHandler
	implements IQueryHandler<GenerateSitemapQuery>
{
	constructor(
		private readonly listArtistIdsQueryHandler: ListArtistIdsQueryHandler,
		private readonly listQuoteIdsQueryHandler: ListQuoteIdsQueryHandler,
	) {}

	async execute(): Promise<Buffer> {
		const [artistIds, quoteIds] = await Promise.all([
			this.listArtistIdsQueryHandler.execute(),
			this.listQuoteIdsQueryHandler.execute(),
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
