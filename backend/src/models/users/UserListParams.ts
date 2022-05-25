import Joi from 'joi';

import { UserSortRule } from '../UserSortRule';

export class UserListParams {
	constructor(
		readonly sort?: UserSortRule,
		readonly offset?: number,
		readonly limit?: number,
		readonly getTotalCount?: boolean,
	) {}

	static readonly schema = Joi.object<UserListParams>({
		offset: Joi.number().optional(),
		limit: Joi.number().optional(),
		getTotalCount: Joi.boolean().optional(),
	});
}
