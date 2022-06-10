import { QuoteListRevisionsQueryHandler } from '../EntryListRevisionsQueryHandler';
import { QuoteGetQueryHandler } from './QuoteGetQueryHandler';
import { QuoteListQueryHandler } from './QuoteListQueryHandler';

export const quoteQueryHandlers = [
	QuoteGetQueryHandler,
	QuoteListQueryHandler,
	QuoteListRevisionsQueryHandler,
];
