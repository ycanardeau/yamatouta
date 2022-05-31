import { artistQueryHandlers } from './artists/artistQueryHandlers';
import { quoteQueryHandlers } from './quotes/quoteQueryHandlers';
import { SitemapGenerateQueryHandler } from './sitemap/SitemapGenerateQueryHandler';
import { translationQueryHandlers } from './translations/translationQueryHandlers';
import { userQueryHandlers } from './users/userQueryHandlers';
import { workQueryHandlers } from './works/workQueryHandlers';

export const queryHandlers = [
	...artistQueryHandlers,
	...quoteQueryHandlers,
	SitemapGenerateQueryHandler,
	...translationQueryHandlers,
	...userQueryHandlers,
	...workQueryHandlers,
];
