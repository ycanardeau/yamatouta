import { TranslationSortRule } from '@/models/translations/TranslationSortRule';
import { WordCategory } from '@/models/translations/WordCategory';
import Joi from 'joi';

export class TranslationListParams {
	constructor(
		readonly sort?: TranslationSortRule,
		readonly offset?: number,
		readonly limit?: number,
		readonly getTotalCount?: boolean,
		readonly query?: string,
		readonly category?: WordCategory,
	) {}

	static readonly schema = Joi.object<TranslationListParams>({
		sort: Joi.string()
			.optional()
			.valid(...Object.values(TranslationSortRule)),
		offset: Joi.number().optional(),
		limit: Joi.number().optional(),
		getTotalCount: Joi.boolean().optional(),
		query: Joi.string().optional().trim().allow(''),
		category: Joi.string()
			.optional()
			.valid(...Object.values(WordCategory)),
	});
}
