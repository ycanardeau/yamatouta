import { quoteApi } from '@/api/quoteApi';
import { IQuoteDto } from '@/dto/IQuoteDto';
import { QuoteSortRule } from '@/models/quotes/QuoteSortRule';
import { QuoteType } from '@/models/quotes/QuoteType';
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

export interface QuoteSearchRouteParams {
	page?: number;
	pageSize?: number;
	sort?: QuoteSortRule;
	query?: string;
	quoteType?: QuoteType;
}

const clearResultsByQueryKeys: (keyof QuoteSearchRouteParams)[] = [
	'pageSize',
	'sort',
	'query',
	'quoteType',
];

export class QuoteSearchStore
	implements LocationStateStore<QuoteSearchRouteParams>
{
	readonly pagination = new PaginationStore({ pageSize: 50 });
	@observable quotes: IQuoteDto[] = [];
	@observable sort: QuoteSortRule;
	@observable query = '';
	@observable submittedQuery = '';
	@observable quoteType: QuoteType | '' = '';
	@observable artistId?: number;
	@observable workId?: number;
	@observable hashtags: string[] = [];

	constructor(private readonly defaultSort = QuoteSortRule.UpdatedDesc) {
		makeObservable(this);

		this.sort = this.defaultSort;
	}

	@action setSort = (value: QuoteSortRule): void => {
		this.sort = value;
	};

	@action setQuery = (value: string): void => {
		this.query = value;
	};

	@action setSubmittedQuery = (value: string): void => {
		this.submittedQuery = value;
		this.query = value;
	};

	@action setQuoteType = (value: QuoteType | ''): void => {
		this.quoteType = value;
	};

	@observable loading = false;

	@action updateResults = async (clearResults: boolean): Promise<void> => {
		if (this.loading) return;

		this.loading = true;
		this.quotes = [];

		try {
			const paginationParams = this.pagination.toParams(clearResults);

			const result = await quoteApi.list({
				pagination: paginationParams,
				sort: this.sort,
				query: this.submittedQuery,
				quoteType: this.quoteType ? this.quoteType : undefined,
				artistId: this.artistId,
				workId: this.workId,
				hashtags: this.hashtags,
			});

			runInAction(() => {
				this.quotes = result.items;

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

	@computed.struct get locationState(): QuoteSearchRouteParams {
		return {
			page: this.pagination.page,
			pageSize: this.pagination.pageSize,
			sort: this.sort,
			query: this.submittedQuery,
			quoteType: this.quoteType ? this.quoteType : undefined,
		};
	}
	set locationState(value: QuoteSearchRouteParams) {
		this.pagination.page = value.page ?? 1;
		this.pagination.pageSize = value.pageSize ?? 50;
		this.sort = value.sort ?? this.defaultSort;
		this.setSubmittedQuery(value.query ?? '');
		this.quoteType = value.quoteType ?? '';
	}

	validateLocationState = (data: any): data is QuoteSearchRouteParams => {
		return validators.quoteSearchRouteParams(data);
	};

	onLocationStateChange = (
		event: StateChangeEvent<QuoteSearchRouteParams>,
	): void => {
		const clearResults = includesAny(clearResultsByQueryKeys, event.keys);

		if (!event.popState && clearResults) this.pagination.goToFirstPage();

		this.updateResults(clearResults);
	};

	@action submit = (): void => {
		this.submittedQuery = this.query;
	};
}
