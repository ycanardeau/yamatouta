import { UserGroup } from '@/models/users/UserGroup';
import { UserSortRule } from '@/models/users/UserSortRule';

export interface UserSearchRouteParams {
	page?: number;
	pageSize?: number;
	sort?: UserSortRule;
	query?: string;
	userGroup?: UserGroup;
}
