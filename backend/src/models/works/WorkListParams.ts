import Joi from 'joi';

import { WorkSortRule } from './WorkSortRule';
import { WorkType } from './WorkType';

export class WorkListParams {
	constructor(
		readonly workType?: WorkType,
		readonly sort?: WorkSortRule,
		readonly offset?: number,
		readonly limit?: number,
		readonly getTotalCount?: boolean,
		readonly query?: string,
	) {}

	static readonly schema = Joi.object<WorkListParams>({
		workType: Joi.string()
			.optional()
			.valid(...Object.values(WorkType)),
		offset: Joi.number().optional(),
		limit: Joi.number().optional(),
		getTotalCount: Joi.boolean().optional(),
		query: Joi.string().optional().allow(''),
	});
}
