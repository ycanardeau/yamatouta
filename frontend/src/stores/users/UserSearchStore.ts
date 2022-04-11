import { computed, makeObservable, observable, runInAction } from 'mobx';

import { ajv } from '../../ajv';
import { listUsers } from '../../api/UserApi';
import { IStoreWithPagination } from '../../components/useStoreWithPagination';
import { ISearchResultObject } from '../../dto/ISearchResultObject';
import { IUserObject } from '../../dto/users/IUserObject';
import { PaginationStore } from '../PaginationStore';

interface IUserSearchRouteParams {
	page?: number;
	pageSize?: number;
}

const userSearchRouteParamsSchema = {
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

const validate = ajv.compile<IUserSearchRouteParams>(
	userSearchRouteParamsSchema,
);

export class UserSearchStore
	implements
		IStoreWithPagination<
			IUserSearchRouteParams,
			ISearchResultObject<IUserObject>
		>
{
	readonly paginationStore = new PaginationStore({ pageSize: 50 });
	@observable users: IUserObject[] = [];

	constructor() {
		makeObservable(this);
	}

	popState = false;

	clearResultsByQueryKeys: (keyof IUserSearchRouteParams)[] = ['pageSize'];

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

	@computed.struct get routeParams(): IUserSearchRouteParams {
		return {
			page: this.paginationStore.page,
			pageSize: this.paginationStore.pageSize,
		};
	}
	set routeParams(value: IUserSearchRouteParams) {
		this.paginationStore.page = value.page ?? 1;
		this.paginationStore.pageSize = value.pageSize ?? 50;
	}

	validateRouteParams = (data: any): data is IUserSearchRouteParams => {
		return validate(data);
	};
}
