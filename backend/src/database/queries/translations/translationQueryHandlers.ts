import { TranslationListRevisionsQueryHandler } from '../EntryListRevisionsQueryHandler';
import { TranslationGetQueryHandler } from './TranslationGetQueryHandler';
import { TranslationListIdsQueryHandler } from './TranslationListIdsQueryHandler';
import { TranslationListQueryHandler } from './TranslationListQueryHandler';

export const translationQueryHandlers = [
	TranslationGetQueryHandler,
	TranslationListIdsQueryHandler,
	TranslationListQueryHandler,
	TranslationListRevisionsQueryHandler,
];
