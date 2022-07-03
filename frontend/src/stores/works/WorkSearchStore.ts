import { StoreWithPagination } from '@vocadb/route-sphere';
import {
	action,
	computed,
	makeObservable,
	observable,
	runInAction,
} from 'mobx';

import { workApi } from '../../api/workApi';
import { IWorkObject } from '../../dto/IWorkObject';
import { IWorkSearchRouteParams } from '../../models/works/IWorkSearchRouteParams';
import { WorkSortRule } from '../../models/works/WorkSortRule';
import { WorkType } from '../../models/works/WorkType';
import * as validators from '../../utils/validate';
import { PaginationStore } from '../PaginationStore';

export class WorkSearchStore
	implements StoreWithPagination<IWorkSearchRouteParams>
{
	readonly pagination = new PaginationStore({ pageSize: 50 });
	@observable works: IWorkObject[] = [];
	@observable sort = WorkSortRule.CreatedAsc;
	@observable query = '';
	@observable submittedQuery = '';
	@observable workType: WorkType | '' = '';

	constructor() {
		makeObservable(this);
	}

	@action setSort = (value: WorkSortRule): void => {
		this.sort = value;
	};

	@action setQuery = (value: string): void => {
		this.query = value;
	};

	@action setSubmittedQuery = (value: string): void => {
		this.submittedQuery = value;
		this.query = value;
	};

	@action setWorkType = (value: WorkType | ''): void => {
		this.workType = value;
	};

	popState = false;

	clearResultsByQueryKeys: (keyof IWorkSearchRouteParams)[] = [
		'pageSize',
		'sort',
		'query',
		'workType',
	];

	@observable loading = false;

	@action updateResults = async (clearResults: boolean): Promise<void> => {
		if (this.loading) return;

		this.loading = true;
		this.works = [];

		try {
			const paginationParams = this.pagination.toParams(clearResults);

			const result = await workApi.list({
				pagination: paginationParams,
				sort: this.sort,
				query: this.submittedQuery,
				workType: this.workType ? this.workType : undefined,
			});

			runInAction(() => {
				this.works = result.items;

				if (paginationParams.getTotalCount)
					this.pagination.totalItems = result.totalCount;
			});

			return;
		} finally {
			runInAction(() => {
				this.loading = false;
			});
		}
	};

	@computed.struct get routeParams(): IWorkSearchRouteParams {
		return {
			page: this.pagination.page,
			pageSize: this.pagination.pageSize,
			sort: this.sort,
			query: this.submittedQuery,
			workType: this.workType ? this.workType : undefined,
		};
	}
	set routeParams(value: IWorkSearchRouteParams) {
		this.pagination.page = value.page ?? 1;
		this.pagination.pageSize = value.pageSize ?? 50;
		this.sort = value.sort ?? WorkSortRule.CreatedAsc;
		this.setSubmittedQuery(value.query ?? '');
		this.workType = value.workType ?? '';
	}

	validateRouteParams = (data: any): data is IWorkSearchRouteParams => {
		return validators.workSearchRouteParams(data);
	};

	onClearResults = (): void => {
		this.pagination.goToFirstPage();
	};

	@action submit = (): void => {
		this.submittedQuery = this.query;
	};
}
