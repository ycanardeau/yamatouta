import { hashtagApi } from '@/api/hashtagApi';
import { IHashtagDto } from '@/dto/IHashtagDto';
import { HashtagSortRule } from '@/models/hashtags/HashtagSortRule';
import { PaginationStore } from '@/stores/PaginationStore';
import {
	LocationStateStore,
	StateChangeEvent,
	includesAny,
} from '@aigamo/route-sphere';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import validate from 'HashtagSearchRouteParams.jsonschema';
import {
	action,
	computed,
	makeObservable,
	observable,
	runInAction,
} from 'mobx';

export interface HashtagSearchRouteParams {
	page?: number;
	pageSize?: number;
	sort?: HashtagSortRule;
	query?: string;
}

const clearResultsByQueryKeys: (keyof HashtagSearchRouteParams)[] = [
	'pageSize',
	'sort',
	'query',
];

export class HashtagSearchStore
	implements LocationStateStore<HashtagSearchRouteParams>
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

	@computed.struct get locationState(): HashtagSearchRouteParams {
		return {
			page: this.pagination.page,
			pageSize: this.pagination.pageSize,
			sort: this.sort,
			query: this.submittedQuery,
		};
	}
	set locationState(value: HashtagSearchRouteParams) {
		this.pagination.page = value.page ?? 1;
		this.pagination.pageSize = value.pageSize ?? 50;
		this.sort = value.sort ?? HashtagSortRule.ReferenceCountDesc;
		this.setSubmittedQuery(value.query ?? '');
	}

	validateLocationState = (data: any): data is HashtagSearchRouteParams => {
		return validate(data);
	};

	onLocationStateChange = (
		event: StateChangeEvent<HashtagSearchRouteParams>,
	): void => {
		const clearResults = includesAny(clearResultsByQueryKeys, event.keys);

		if (!event.popState && clearResults) this.pagination.goToFirstPage();

		this.updateResults(clearResults);
	};

	@action submit = (): void => {
		this.submittedQuery = this.query;
	};
}
