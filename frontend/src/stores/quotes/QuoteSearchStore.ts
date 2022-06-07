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
import * as validators from '../../utils/validate';
import { PaginationStore } from '../PaginationStore';

export class QuoteSearchStore
	implements StoreWithPagination<IQuoteSearchRouteParams>
{
	readonly pagination = new PaginationStore({ pageSize: 50 });
	@observable quotes: IQuoteObject[] = [];
	@observable artistId?: number;
	@observable workId?: number;

	constructor() {
		makeObservable(this);
	}

	popState = false;

	clearResultsByQueryKeys: (keyof IQuoteSearchRouteParams)[] = ['pageSize'];

	@observable loading = false;

	@action updateResults = async (clearResults: boolean): Promise<void> => {
		if (this.loading) return;

		this.loading = true;
		this.quotes = [];

		try {
			const paginationParams = this.pagination.toParams(clearResults);

			const result = await quoteApi.list({
				pagination: paginationParams,
				artistId: this.artistId,
				workId: this.workId,
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
		};
	}
	set routeParams(value: IQuoteSearchRouteParams) {
		this.pagination.page = value.page ?? 1;
		this.pagination.pageSize = value.pageSize ?? 50;
	}

	validateRouteParams = (data: any): data is IQuoteSearchRouteParams => {
		return validators.quoteSearchRouteParams(data);
	};

	onClearResults = (): void => {
		this.pagination.goToFirstPage();
	};
}
