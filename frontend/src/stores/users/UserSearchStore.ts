import { StoreWithPagination } from '@vocadb/route-sphere';
import {
	action,
	computed,
	makeObservable,
	observable,
	runInAction,
} from 'mobx';

import { userApi } from '../../api/userApi';
import { IUserObject } from '../../dto/IUserObject';
import { IUserSearchRouteParams } from '../../models/users/IUserSearchRouteParams';
import { UserGroup } from '../../models/users/UserGroup';
import { UserSortRule } from '../../models/users/UserSortRule';
import * as validators from '../../utils/validate';
import { PaginationStore } from '../PaginationStore';

export class UserSearchStore
	implements StoreWithPagination<IUserSearchRouteParams>
{
	readonly pagination = new PaginationStore({ pageSize: 50 });
	@observable users: IUserObject[] = [];
	@observable sort = UserSortRule.CreatedAsc;
	@observable query = '';
	@observable userGroup?: UserGroup;

	constructor() {
		makeObservable(this);
	}

	@action setSort = (value: UserSortRule): void => {
		this.sort = value;
	};

	@action setQuery = (value: string): void => {
		this.query = value;
	};

	@action setUserGroup = (value?: UserGroup): void => {
		this.userGroup = value;
	};

	popState = false;

	clearResultsByQueryKeys: (keyof IUserSearchRouteParams)[] = ['pageSize'];

	@observable loading = false;

	@action updateResults = async (clearResults: boolean): Promise<void> => {
		if (this.loading) return;

		this.loading = true;
		this.users = [];

		try {
			const paginationParams = this.pagination.toParams(clearResults);

			const result = await userApi.list({
				pagination: paginationParams,
			});

			runInAction(() => {
				this.users = result.items;

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

	@computed.struct get routeParams(): IUserSearchRouteParams {
		return {
			page: this.pagination.page,
			pageSize: this.pagination.pageSize,
		};
	}
	set routeParams(value: IUserSearchRouteParams) {
		this.pagination.page = value.page ?? 1;
		this.pagination.pageSize = value.pageSize ?? 50;
	}

	validateRouteParams = (data: any): data is IUserSearchRouteParams => {
		return validators.userSearchRouteParams(data);
	};

	onClearResults = (): void => {
		this.pagination.goToFirstPage();
	};
}
