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
	offset: Joi.number().optional(),
	limit: Joi.number().optional(),
	getTotalCount: Joi.boolean().optional(),
	query: Joi.string().optional().allow(''),
});
