import { computed, makeObservable, observable, runInAction } from 'mobx';

import { ajv } from '../../ajv';
import { listWorks } from '../../api/WorkApi';
import { IStoreWithPagination } from '../../components/useStoreWithPagination';
import { ISearchResultObject } from '../../dto/ISearchResultObject';
import { IWorkObject } from '../../dto/works/IWorkObject';
import { PaginationStore } from '../PaginationStore';

interface IWorkSearchRouteParams {
	page?: number;
	pageSize?: number;
}

const workSearchRouteParamsSchema = {
	$schema: 'http://json-schema.org/draft-07/schema#',
	properties: {
		page: {
			type: 'number',
		},
		pageSize: {
			type: 'number',
		},
	},
	type: 'object',
};

const validate = ajv.compile<IWorkSearchRouteParams>(
	workSearchRouteParamsSchema,
);

export class WorkSearchStore
	implements
		IStoreWithPagination<
			IWorkSearchRouteParams,
			ISearchResultObject<IWorkObject>
		>
{
	readonly paginationStore = new PaginationStore({ pageSize: 50 });
	@observable works: IWorkObject[] = [];

	constructor() {
		makeObservable(this);
	}

	popState = false;

	clearResultsByQueryKeys: (keyof IWorkSearchRouteParams)[] = ['pageSize'];

	updateResults = async (
		clearResults: boolean,
	): Promise<ISearchResultObject<IWorkObject>> => {
		const paginationParams = this.paginationStore.toParams(clearResults);

		const result = await listWorks({
			pagination: paginationParams,
		});

		runInAction(() => {
			this.works = result.items;

			if (paginationParams.getTotalCount)
				this.paginationStore.totalItems = result.totalCount;
		});

		return result;
	};

	@computed.struct get routeParams(): IWorkSearchRouteParams {
		return {
			page: this.paginationStore.page,
			pageSize: this.paginationStore.pageSize,
		};
	}
	set routeParams(value: IWorkSearchRouteParams) {
		this.paginationStore.page = value.page ?? 1;
		this.paginationStore.pageSize = value.pageSize ?? 50;
	}

	validateRouteParams = (data: any): data is IWorkSearchRouteParams => {
		return validate(data);
	};
}
