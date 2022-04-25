import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SitemapStream, streamToPromise } from 'sitemap';

import { ListArtistIdsQueryHandler } from '../artists/ListArtistIdsQueryHandler';
import { ListQuoteIdsQueryHandler } from '../quotes/ListQuoteIdsQueryHandler';
import { ListTranslationIdsQueryHandler } from '../translations/ListTranslationIdsQueryHandler';
import { ListWorkIdsQueryHandler } from '../works/ListWorkIdsQueryHandler';

export class GenerateSitemapQuery {}

@QueryHandler(GenerateSitemapQuery)
export class GenerateSitemapQueryHandler
	implements IQueryHandler<GenerateSitemapQuery>
{
	constructor(
		private readonly listArtistIdsQueryHandler: ListArtistIdsQueryHandler,
		private readonly listQuoteIdsQueryHandler: ListQuoteIdsQueryHandler,
		private readonly listTranslationIdsQueryHandler: ListTranslationIdsQueryHandler,
		private readonly listWorkIdsQueryHandler: ListWorkIdsQueryHandler,
	) {}

	async execute(): Promise<Buffer> {
		const [artistIds, quoteIds, translationIds, workIds] =
			await Promise.all([
				this.listArtistIdsQueryHandler.execute(),
				this.listQuoteIdsQueryHandler.execute(),
				this.listTranslationIdsQueryHandler.execute(),
				this.listWorkIdsQueryHandler.execute(),
			]);

		const sitemapStream = new SitemapStream({
			hostname: 'https://yamatouta.net',
		});

		for (const artistId of artistIds)
			sitemapStream.write({ url: `/artists/${artistId}` });

		for (const quoteId of quoteIds)
			sitemapStream.write({ url: `/quotes/${quoteId}` });

		for (const translationId of translationIds)
			sitemapStream.write({ url: `/translations/${translationId}` });

		for (const workId of workIds)
			sitemapStream.write({ url: `/works/${workId}` });

		sitemapStream.end();

		return streamToPromise(sitemapStream);
	}
}
