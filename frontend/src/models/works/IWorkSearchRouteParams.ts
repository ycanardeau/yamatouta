import { WorkSortRule } from '@/models/works/WorkSortRule';
import { WorkType } from '@/models/works/WorkType';

export interface IWorkSearchRouteParams {
	page?: number;
	pageSize?: number;
	sort?: WorkSortRule;
	query?: string;
	workType?: WorkType;
}
