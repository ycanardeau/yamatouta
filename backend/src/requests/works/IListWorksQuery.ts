import Joi, { ObjectSchema } from 'joi';

import { WorkSortRule } from '../../models/WorkSortRule';
import { WorkType } from '../../models/WorkType';

export interface IListWorksQuery {
	workType?: WorkType;
	sort?: WorkSortRule;
	offset?: number;
	limit?: number;
	getTotalCount?: boolean;
	query?: string;
}

export const listWorksQuerySchema: ObjectSchema<IListWorksQuery> = Joi.object({
	workType: Joi.string()
		.optional()
		.valid(...Object.values(WorkType)),
	offset: Joi.number().optional(),
	limit: Joi.number().optional(),
	getTotalCount: Joi.boolean().optional(),
	query: Joi.string().optional().allow(''),
});
