import { UserGroup } from '@/models/users/UserGroup';
import { UserSortRule } from '@/models/users/UserSortRule';

export interface IUserSearchRouteParams {
	page?: number;
	pageSize?: number;
	sort?: UserSortRule;
	query?: string;
	userGroup?: UserGroup;
}
