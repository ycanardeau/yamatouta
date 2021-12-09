import { UserSortRule } from '../../dto/users/UserSortRule';

export interface IListUsersQuery {
	sort?: UserSortRule;
	offset?: number;
	limit?: number;
	getTotalCount?: boolean;
}

export const listUsersQuerySchema = {
	$schema: 'http://json-schema.org/draft-07/schema#',
	definitions: {
		UserSortRule: {},
	},
	properties: {
		getTotalCount: {
			type: 'boolean',
		},
		limit: {
			type: 'number',
		},
		offset: {
			type: 'number',
		},
		sort: {
			$ref: '#/definitions/UserSortRule',
		},
	},
	type: 'object',
};
