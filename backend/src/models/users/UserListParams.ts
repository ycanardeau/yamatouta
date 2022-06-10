import Joi from 'joi';

import { UserGroup } from './UserGroup';
import { UserSortRule } from './UserSortRule';

export class UserListParams {
	constructor(
		readonly sort?: UserSortRule,
		readonly offset?: number,
		readonly limit?: number,
		readonly getTotalCount?: boolean,
		readonly query?: string,
		readonly userGroup?: UserGroup,
	) {}

	static readonly schema = Joi.object<UserListParams>({
		sort: Joi.string()
			.optional()
			.valid(...Object.values(UserSortRule)),
		offset: Joi.number().optional(),
		limit: Joi.number().optional(),
		getTotalCount: Joi.boolean().optional(),
		query: Joi.string().optional().allow(''),
		userGroup: Joi.string()
			.optional()
			.valid(...Object.values(UserGroup)),
	});
}
