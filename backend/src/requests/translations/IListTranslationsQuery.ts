import Joi from 'joi';

import { TranslationSortRule } from '../../models/TranslationSortRule';
import { WordCategory } from '../../models/WordCategory';

export interface IListTranslationsQuery {
	sort?: TranslationSortRule;
	offset?: number;
	limit?: number;
	getTotalCount?: boolean;
	query?: string;
	category?: WordCategory;
}

export const listTranslationsQuerySchema = Joi.object({
	sort: Joi.string()
		.optional()
		.valid(...Object.values(TranslationSortRule)),
	offset: Joi.number().optional(),
	limit: Joi.number().optional(),
	getTotalCount: Joi.boolean().optional(),
	query: Joi.string().optional().allow(''),
	category: Joi.string()
		.optional()
		.allow('')
		.valid(...Object.values(WordCategory)),
});
