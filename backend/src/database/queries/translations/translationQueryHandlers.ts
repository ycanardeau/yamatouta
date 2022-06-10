import { TranslationListRevisionsQueryHandler } from '../EntryListRevisionsQueryHandler';
import { TranslationGetQueryHandler } from './TranslationGetQueryHandler';
import { TranslationListQueryHandler } from './TranslationListQueryHandler';

export const translationQueryHandlers = [
	TranslationGetQueryHandler,
	TranslationListQueryHandler,
	TranslationListRevisionsQueryHandler,
];
