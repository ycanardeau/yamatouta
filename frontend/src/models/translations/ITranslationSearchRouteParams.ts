import { TranslationSortRule } from './TranslationSortRule';
import { WordCategory } from './WordCategory';

export interface ITranslationSearchRouteParams {
	page?: number;
	pageSize?: number;
	sort?: TranslationSortRule;
	query?: string;
	category?: WordCategory;
}
