import Joi, { ObjectSchema } from 'joi';

import { UserSortRule } from '../../models/UserSortRule';

export interface IListUsersQuery {
	sort?: UserSortRule;
	offset?: number;
	limit?: number;
	getTotalCount?: boolean;
}

export const listUsersQuerySchema: ObjectSchema<IListUsersQuery> = Joi.object({
	offset: Joi.number().optional(),
	limit: Joi.number().optional(),
	getTotalCount: Joi.boolean().optional(),
});
