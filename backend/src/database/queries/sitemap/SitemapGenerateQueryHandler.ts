import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SitemapStream, streamToPromise } from 'sitemap';

import { ArtistListIdsQueryHandler } from '../artists/ArtistListIdsQueryHandler';
import { QuoteListIdsQueryHandler } from '../quotes/QuoteListIdsQueryHandler';
import { TranslationListIdsQueryHandler } from '../translations/TranslationListIdsQueryHandler';
import { WorkListIdsQueryHandler } from '../works/WorkListIdsQueryHandler';

export class SitemapGenerateQuery {}

@QueryHandler(SitemapGenerateQuery)
export class SitemapGenerateQueryHandler
	implements IQueryHandler<SitemapGenerateQuery>
{
	constructor(
		private readonly artistListIdsQueryHandler: ArtistListIdsQueryHandler,
		private readonly quoteListIdsQueryHandler: QuoteListIdsQueryHandler,
		private readonly translationListIdsQueryHandler: TranslationListIdsQueryHandler,
		private readonly workListIdsQueryHandler: WorkListIdsQueryHandler,
	) {}

	async execute(): Promise<Buffer> {
		const [artistIds, quoteIds, translationIds, workIds] =
			await Promise.all([
				this.artistListIdsQueryHandler.execute(),
				this.quoteListIdsQueryHandler.execute(),
				this.translationListIdsQueryHandler.execute(),
				this.workListIdsQueryHandler.execute(),
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
