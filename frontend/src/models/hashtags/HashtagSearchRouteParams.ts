import { HashtagSortRule } from '@/models/hashtags/HashtagSortRule';

export interface HashtagSearchRouteParams {
	page?: number;
	pageSize?: number;
	sort?: HashtagSortRule;
	query?: string;
}
