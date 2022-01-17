import Joi from 'joi';

import { TranslationSortRule } from '../../dto/translations/TranslationSortRule';

export interface IListTranslationsQuery {
	sort?: TranslationSortRule;
	offset?: number;
	limit?: number;
	getTotalCount?: boolean;
	query?: string;
}

export const listTranslationsQuerySchema = Joi.object({
	sort: Joi.string()
		.optional()
		.valid(...Object.values(TranslationSortRule)),
	offset: Joi.number().optional(),
	limit: Joi.number().optional(),
	getTotalCount: Joi.boolean().optional(),
	query: Joi.string().optional().allow(''),
});
