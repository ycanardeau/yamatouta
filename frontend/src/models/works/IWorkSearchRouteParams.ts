import { WorkSortRule } from './WorkSortRule';
import { WorkType } from './WorkType';

export interface IWorkSearchRouteParams {
	page?: number;
	pageSize?: number;
	sort?: WorkSortRule;
	query?: string;
	workType?: WorkType;
}
