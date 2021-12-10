import { computed, makeObservable, observable, runInAction } from 'mobx';

import { ajv } from '../../ajv';
import { listUsers } from '../../api/UserApi';
import { IStoreWithPagination } from '../../components/useStoreWithPagination';
import { ISearchResultObject } from '../../dto/ISearchResultObject';
import { IUserObject } from '../../dto/users/IUserObject';
import { PaginationStore } from '../PaginationStore';

interface IUserIndexRouteParams {
	page?: number;
	pageSize?: number;
}

const userIndexRouteParamsSchema = {
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

const validate = ajv.compile<IUserIndexRouteParams>(userIndexRouteParamsSchema);

export class UserIndexStore
	implements
		IStoreWithPagination<
			IUserIndexRouteParams,
			ISearchResultObject<IUserObject>
		>
{
	readonly paginationStore = new PaginationStore();

	@observable users: IUserObject[] = [];

	constructor() {
		makeObservable(this);
	}

	popState = false;

	clearResultsByQueryKeys: (keyof IUserIndexRouteParams)[] = [];

	updateResults = async (
		clearResults: boolean,
	): Promise<ISearchResultObject<IUserObject>> => {
		const paginationParams = this.paginationStore.toParams(clearResults);

		const result = await listUsers({
			pagination: paginationParams,
		});

		runInAction(() => {
			this.users = result.items;

			if (paginationParams.getTotalCount)
				this.paginationStore.totalItems = result.totalCount;
		});

		return result;
	};

	@computed.struct get routeParams(): IUserIndexRouteParams {
		return {
			page: this.paginationStore.page,
			pageSize: this.paginationStore.pageSize,
		};
	}
	set routeParams(value: IUserIndexRouteParams) {
		this.paginationStore.page = value.page ?? 1;
		this.paginationStore.pageSize = value.pageSize ?? 10;
	}

	validateRouteParams = (data: any): data is IUserIndexRouteParams =>
		validate(data);
}
