import { UserGroup } from './UserGroup';
import { UserSortRule } from './UserSortRule';

export interface IUserSearchRouteParams {
	page?: number;
	pageSize?: number;
	sort?: UserSortRule;
	query?: string;
	userGroup?: UserGroup;
}
