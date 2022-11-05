import { userApi } from '@/api/userApi';
import { IUserObject } from '@/dto/IUserObject';
import { IUserSearchRouteParams } from '@/models/users/IUserSearchRouteParams';
import { UserGroup } from '@/models/users/UserGroup';
import { UserSortRule } from '@/models/users/UserSortRule';
import { PaginationStore } from '@/stores/PaginationStore';
import * as validators from '@/utils/validate';
import { StoreWithPagination } from '@vocadb/route-sphere';
import {
	action,
	computed,
	makeObservable,
	observable,
	runInAction,
} from 'mobx';

export class UserSearchStore
	implements StoreWithPagination<IUserSearchRouteParams>
{
	readonly pagination = new PaginationStore({ pageSize: 50 });
	@observable users: IUserObject[] = [];
	@observable sort = UserSortRule.CreatedAsc;
	@observable query = '';
	@observable submittedQuery = '';
	@observable userGroup: UserGroup | '' = '';

	constructor() {
		makeObservable(this);
	}

	@action setSort = (value: UserSortRule): void => {
		this.sort = value;
	};

	@action setQuery = (value: string): void => {
		this.query = value;
	};

	@action setSubmittedQuery = (value: string): void => {
		this.submittedQuery = value;
		this.query = value;
	};

	@action setUserGroup = (value: UserGroup | ''): void => {
		this.userGroup = value;
	};

	popState = false;

	clearResultsByQueryKeys: (keyof IUserSearchRouteParams)[] = [
		'pageSize',
		'sort',
		'query',
		'userGroup',
	];

	@observable loading = false;

	@action updateResults = async (clearResults: boolean): Promise<void> => {
		if (this.loading) return;

		this.loading = true;
		this.users = [];

		try {
			const paginationParams = this.pagination.toParams(clearResults);

			const result = await userApi.list({
				pagination: paginationParams,
				sort: this.sort,
				query: this.submittedQuery,
				userGroup: this.userGroup ? this.userGroup : undefined,
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
			sort: this.sort,
			query: this.submittedQuery,
			userGroup: this.userGroup ? this.userGroup : undefined,
		};
	}
	set routeParams(value: IUserSearchRouteParams) {
		this.pagination.page = value.page ?? 1;
		this.pagination.pageSize = value.pageSize ?? 50;
		this.sort = value.sort ?? UserSortRule.CreatedAsc;
		this.setSubmittedQuery(value.query ?? '');
		this.userGroup = value.userGroup ?? '';
	}

	validateRouteParams = (data: any): data is IUserSearchRouteParams => {
		return validators.userSearchRouteParams(data);
	};

	onClearResults = (): void => {
		this.pagination.goToFirstPage();
	};

	@action submit = (): void => {
		this.submittedQuery = this.query;
	};
}
