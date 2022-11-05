import { TranslationSortRule } from '@/models/translations/TranslationSortRule';
import { WordCategory } from '@/models/translations/WordCategory';

export interface ITranslationSearchRouteParams {
	page?: number;
	pageSize?: number;
	sort?: TranslationSortRule;
	query?: string;
	category?: WordCategory;
}
