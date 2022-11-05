import { hashtagApi } from '@/api/hashtagApi';
import { IHashtagDto } from '@/dto/IHashtagDto';
import { HashtagSortRule } from '@/models/hashtags/HashtagSortRule';
import { IHashtagSearchRouteParams } from '@/models/hashtags/IHashtagSearchRouteParams';
import { PaginationStore } from '@/stores/PaginationStore';
import * as validators from '@/utils/validate';
import {
	includesAny,
	LocationStateStore,
	StateChangeEvent,
} from '@vocadb/route-sphere';
import {
	action,
	computed,
	makeObservable,
	observable,
	runInAction,
} from 'mobx';

const clearResultsByQueryKeys: (keyof IHashtagSearchRouteParams)[] = [
	'pageSize',
	'sort',
	'query',
];

export class HashtagSearchStore
	implements LocationStateStore<IHashtagSearchRouteParams>
{
	readonly pagination = new PaginationStore({ pageSize: 50 });
	@observable hashtags: IHashtagDto[] = [];
	@observable sort = HashtagSortRule.ReferenceCountDesc;
	@observable query = '';
	@observable submittedQuery = '';

	constructor() {
		makeObservable(this);
	}

	@computed get isSortedByName(): boolean {
		return (
			this.sort === HashtagSortRule.NameAsc ||
			this.sort === HashtagSortRule.NameDesc
		);
	}

	@computed get isSortedByReferenceCount(): boolean {
		return (
			this.sort === HashtagSortRule.ReferenceCountAsc ||
			this.sort === HashtagSortRule.ReferenceCountDesc
		);
	}

	@action toggleSortByName = (): void => {
		this.sort =
			this.sort === HashtagSortRule.NameAsc
				? HashtagSortRule.NameDesc
				: HashtagSortRule.NameAsc;
	};

	@action toggleSortByReferenceCount = (): void => {
		this.sort =
			this.sort === HashtagSortRule.ReferenceCountDesc
				? HashtagSortRule.ReferenceCountAsc
				: HashtagSortRule.ReferenceCountDesc;
	};

	@action setQuery = (value: string): void => {
		this.query = value;
	};

	@action setSubmittedQuery = (value: string): void => {
		this.submittedQuery = value;
		this.query = value;
	};

	@observable loading = false;

	@action updateResults = async (clearResults: boolean): Promise<void> => {
		if (this.loading) return;

		this.loading = true;
		this.hashtags = [];

		try {
			const paginationParams = this.pagination.toParams(clearResults);

			const result = await hashtagApi.list({
				pagination: paginationParams,
				sort: this.sort,
				query: this.submittedQuery,
			});

			runInAction(() => {
				this.hashtags = result.items;

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

	@computed.struct get locationState(): IHashtagSearchRouteParams {
		return {
			page: this.pagination.page,
			pageSize: this.pagination.pageSize,
			sort: this.sort,
			query: this.submittedQuery,
		};
	}
	set locationState(value: IHashtagSearchRouteParams) {
		this.pagination.page = value.page ?? 1;
		this.pagination.pageSize = value.pageSize ?? 50;
		this.sort = value.sort ?? HashtagSortRule.ReferenceCountDesc;
		this.setSubmittedQuery(value.query ?? '');
	}

	validateLocationState = (data: any): data is IHashtagSearchRouteParams => {
		return validators.hashtagSearchRouteParams(data);
	};

	onLocationStateChange = (
		event: StateChangeEvent<IHashtagSearchRouteParams>,
	): void => {
		const clearResults = includesAny(clearResultsByQueryKeys, event.keys);

		if (!event.popState && clearResults) this.pagination.goToFirstPage();

		this.updateResults(clearResults);
	};

	@action submit = (): void => {
		this.submittedQuery = this.query;
	};
}
