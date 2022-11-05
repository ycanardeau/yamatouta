import { QuoteListRevisionsQueryHandler } from '@/database/queries/EntryListRevisionsQueryHandler';
import { QuoteGetQueryHandler } from '@/database/queries/quotes/QuoteGetQueryHandler';
import { QuoteListQueryHandler } from '@/database/queries/quotes/QuoteListQueryHandler';

export const quoteQueryHandlers = [
	QuoteGetQueryHandler,
	QuoteListQueryHandler,
	QuoteListRevisionsQueryHandler,
];
