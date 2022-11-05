import { HashtagSortRule } from '@/models/hashtags/HashtagSortRule';
import Joi from 'joi';

export class HashtagListParams {
	constructor(
		readonly sort?: HashtagSortRule,
		readonly offset?: number,
		readonly limit?: number,
		readonly getTotalCount?: boolean,
		readonly query?: string,
	) {}

	static readonly schema = Joi.object<HashtagListParams>({
		sort: Joi.string()
			.optional()
			.valid(...Object.values(HashtagSortRule)),
		offset: Joi.number().optional(),
		limit: Joi.number().optional(),
		getTotalCount: Joi.boolean().optional(),
		query: Joi.string().optional().trim().allow(''),
	});
}
