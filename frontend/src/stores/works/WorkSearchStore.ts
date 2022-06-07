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
import * as validators from '../../utils/validate';
import { PaginationStore } from '../PaginationStore';

export class WorkSearchStore
	implements StoreWithPagination<IWorkSearchRouteParams>
{
	readonly pagination = new PaginationStore({ pageSize: 50 });
	@observable works: IWorkObject[] = [];

	constructor() {
		makeObservable(this);
	}

	popState = false;

	clearResultsByQueryKeys: (keyof IWorkSearchRouteParams)[] = ['pageSize'];

	@observable loading = false;

	@action updateResults = async (clearResults: boolean): Promise<void> => {
		if (this.loading) return;

		this.loading = true;
		this.works = [];

		try {
			const paginationParams = this.pagination.toParams(clearResults);

			const result = await workApi.list({
				pagination: paginationParams,
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
		};
	}
	set routeParams(value: IWorkSearchRouteParams) {
		this.pagination.page = value.page ?? 1;
		this.pagination.pageSize = value.pageSize ?? 50;
	}

	validateRouteParams = (data: any): data is IWorkSearchRouteParams => {
		return validators.workSearchRouteParams(data);
	};

	onClearResults = (): void => {
		this.pagination.goToFirstPage();
	};
}
