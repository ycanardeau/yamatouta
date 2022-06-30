import { StoreWithPagination } from '@vocadb/route-sphere';
import {
	action,
	computed,
	makeObservable,
	observable,
	runInAction,
} from 'mobx';

import { quoteApi } from '../../api/quoteApi';
import { IQuoteObject } from '../../dto/IQuoteObject';
import { IQuoteSearchRouteParams } from '../../models/quotes/IQuoteSearchRouteParams';
import { QuoteSortRule } from '../../models/quotes/QuoteSortRule';
import { QuoteType } from '../../models/quotes/QuoteType';
import * as validators from '../../utils/validate';
import { PaginationStore } from '../PaginationStore';

export class QuoteSearchStore
	implements StoreWithPagination<IQuoteSearchRouteParams>
{
	readonly pagination = new PaginationStore({ pageSize: 50 });
	@observable quotes: IQuoteObject[] = [];
	@observable sort: QuoteSortRule;
	@observable query = '';
	@observable quoteType: QuoteType | '' = '';
	@observable artistId?: number;
	@observable workId?: number;
	@observable hashtags: string[] = [];

	constructor(private readonly defaultSort = QuoteSortRule.CreatedAsc) {
		makeObservable(this);

		this.sort = this.defaultSort;
	}

	@action setSort = (value: QuoteSortRule): void => {
		this.sort = value;
	};

	@action setQuery = (value: string): void => {
		this.query = value;
	};

	@action setQuoteType = (value: QuoteType | ''): void => {
		this.quoteType = value;
	};

	popState = false;

	clearResultsByQueryKeys: (keyof IQuoteSearchRouteParams)[] = [
		'pageSize',
		'sort',
		'query',
		'quoteType',
	];

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
				query: this.query,
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

	@computed.struct get routeParams(): IQuoteSearchRouteParams {
		return {
			page: this.pagination.page,
			pageSize: this.pagination.pageSize,
			sort: this.sort,
			query: this.query,
			quoteType: this.quoteType ? this.quoteType : undefined,
		};
	}
	set routeParams(value: IQuoteSearchRouteParams) {
		this.pagination.page = value.page ?? 1;
		this.pagination.pageSize = value.pageSize ?? 50;
		this.sort = value.sort ?? this.defaultSort;
		this.query = value.query ?? '';
		this.quoteType = value.quoteType ?? '';
	}

	validateRouteParams = (data: any): data is IQuoteSearchRouteParams => {
		return validators.quoteSearchRouteParams(data);
	};

	onClearResults = (): void => {
		this.pagination.goToFirstPage();
	};
}
