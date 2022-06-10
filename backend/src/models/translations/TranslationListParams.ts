import Joi from 'joi';

import { TranslationSortRule } from './TranslationSortRule';
import { WordCategory } from './WordCategory';

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
		query: Joi.string().optional().allow(''),
		category: Joi.string()
			.optional()
			.valid(...Object.values(WordCategory)),
	});
}
