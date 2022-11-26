import { TranslationSortRule } from '@/models/translations/TranslationSortRule';
import { WordCategory } from '@/models/translations/WordCategory';

export interface TranslationSearchRouteParams {
	page?: number;
	pageSize?: number;
	sort?: TranslationSortRule;
	query?: string;
	category?: WordCategory;
}
