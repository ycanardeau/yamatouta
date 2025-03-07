import { userApi } from '@/api/userApi';
import { IUserDto } from '@/dto/IUserDto';
import { ajv } from '@/helpers/ajv';
import { UserGroup } from '@/models/users/UserGroup';
import { UserSortRule } from '@/models/users/UserSortRule';
import { PaginationStore } from '@/stores/PaginationStore';
import {
	LocationStateStore,
	StateChangeEvent,
	includesAny,
} from '@aigamo/route-sphere';
import { JSONSchemaType } from 'ajv';
import {
	action,
	computed,
	makeObservable,
	observable,
	runInAction,
} from 'mobx';

export interface UserSearchRouteParams {
	page?: number;
	pageSize?: number;
	sort?: UserSortRule;
	query?: string;
	userGroup?: UserGroup;
}

const UserSearchRouteParamsSchema: JSONSchemaType<UserSearchRouteParams> = {
	type: 'object',
	properties: {
		page: {
			type: 'number',
			nullable: true,
		},
		pageSize: {
			type: 'number',
			nullable: true,
		},
		query: {
			type: 'string',
			nullable: true,
		},
		sort: {
			enum: Object.values(UserSortRule),
			type: 'string',
			nullable: true,
		},
		userGroup: {
			enum: Object.values(UserGroup),
			type: 'string',
			nullable: true,
		},
	},
};

const clearResultsByQueryKeys: (keyof UserSearchRouteParams)[] = [
	'pageSize',
	'sort',
	'query',
	'userGroup',
];

export class UserSearchStore
	implements LocationStateStore<UserSearchRouteParams>
{
	readonly pagination = new PaginationStore({ pageSize: 50 });
	@observable users: IUserDto[] = [];
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

	@computed.struct get locationState(): UserSearchRouteParams {
		return {
			page: this.pagination.page,
			pageSize: this.pagination.pageSize,
			sort: this.sort,
			query: this.submittedQuery,
			userGroup: this.userGroup ? this.userGroup : undefined,
		};
	}
	set locationState(value: UserSearchRouteParams) {
		this.pagination.page = value.page ?? 1;
		this.pagination.pageSize = value.pageSize ?? 50;
		this.sort = value.sort ?? UserSortRule.CreatedAsc;
		this.setSubmittedQuery(value.query ?? '');
		this.userGroup = value.userGroup ?? '';
	}

	validateLocationState = (data: any): data is UserSearchRouteParams => {
		return ajv.validate(UserSearchRouteParamsSchema, data);
	};

	onLocationStateChange = (
		event: StateChangeEvent<UserSearchRouteParams>,
	): void => {
		const clearResults = includesAny(clearResultsByQueryKeys, event.keys);

		if (!event.popState && clearResults) this.pagination.goToFirstPage();

		this.updateResults(clearResults);
	};

	@action submit = (): void => {
		this.submittedQuery = this.query;
	};
}
