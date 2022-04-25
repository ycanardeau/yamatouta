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
	readonly pagination = new PaginationStore({ pageSize: 50 });
	@observable works: IWorkObject[] = [];

	constructor() {
		makeObservable(this);
	}

	popState = false;

	clearResultsByQueryKeys: (keyof IWorkSearchRouteParams)[] = ['pageSize'];

	updateResults = async (
		clearResults: boolean,
	): Promise<ISearchResultObject<IWorkObject>> => {
		const paginationParams = this.pagination.toParams(clearResults);

		const result = await listWorks({
			pagination: paginationParams,
		});

		runInAction(() => {
			this.works = result.items;

			if (paginationParams.getTotalCount)
				this.pagination.totalItems = result.totalCount;
		});

		return result;
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
		return validate(data);
	};
}
