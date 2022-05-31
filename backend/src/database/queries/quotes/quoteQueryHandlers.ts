import { QuoteListRevisionsQueryHandler } from '../EntryListRevisionsQueryHandler';
import { QuoteGetQueryHandler } from './QuoteGetQueryHandler';
import { QuoteListIdsQueryHandler } from './QuoteListIdsQueryHandler';
import { QuoteListQueryHandler } from './QuoteListQueryHandler';

export const quoteQueryHandlers = [
	QuoteGetQueryHandler,
	QuoteListIdsQueryHandler,
	QuoteListQueryHandler,
	QuoteListRevisionsQueryHandler,
];
