import { TranslationListRevisionsQueryHandler } from '@/database/queries/EntryListRevisionsQueryHandler';
import { TranslationGetQueryHandler } from '@/database/queries/translations/TranslationGetQueryHandler';
import { TranslationListQueryHandler } from '@/database/queries/translations/TranslationListQueryHandler';

export const translationQueryHandlers = [
	TranslationGetQueryHandler,
	TranslationListQueryHandler,
	TranslationListRevisionsQueryHandler,
];
