import { HashtagSortRule } from './HashtagSortRule';

export interface IHashtagSearchRouteParams {
	page?: number;
	pageSize?: number;
	sort?: HashtagSortRule;
	query?: string;
}
