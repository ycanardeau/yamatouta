import { WorkSortRule } from '@/models/works/WorkSortRule';
import { WorkType } from '@/models/works/WorkType';
import Joi from 'joi';

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
		sort: Joi.string()
			.optional()
			.valid(...Object.values(WorkSortRule)),
		offset: Joi.number().optional(),
		limit: Joi.number().optional(),
		getTotalCount: Joi.boolean().optional(),
		query: Joi.string().optional().trim().allow(''),
	});
}
