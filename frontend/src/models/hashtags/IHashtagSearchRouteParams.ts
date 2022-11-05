import { HashtagSortRule } from '@/models/hashtags/HashtagSortRule';

export interface IHashtagSearchRouteParams {
	page?: number;
	pageSize?: number;
	sort?: HashtagSortRule;
	query?: string;
}
