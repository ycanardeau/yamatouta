import { computed, makeObservable, observable, runInAction } from 'mobx';

import { ajv } from '../../ajv';
import { listQuotes } from '../../api/QuoteApi';
import { IStoreWithPagination } from '../../components/useStoreWithPagination';
import { ISearchResultObject } from '../../dto/ISearchResultObject';
import { IQuoteObject } from '../../dto/quotes/IQuoteObject';
import { PaginationStore } from '../PaginationStore';

interface IQuoteIndexRouteParams {
	page?: number;
	pageSize?: number;
}

const quoteIndexRouteParamsSchema = {
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

const validate = ajv.compile<IQuoteIndexRouteParams>(
	quoteIndexRouteParamsSchema,
);

export class QuoteIndexStore
	implements
		IStoreWithPagination<
			IQuoteIndexRouteParams,
			ISearchResultObject<IQuoteObject>
		>
{
	readonly paginationStore = new PaginationStore();

	@observable quotes: IQuoteObject[] = [];
	@observable artistId?: number;

	constructor() {
		makeObservable(this);
	}

	popState = false;

	clearResultsByQueryKeys: (keyof IQuoteIndexRouteParams)[] = [];

	updateResults = async (
		clearResults: boolean,
	): Promise<ISearchResultObject<IQuoteObject>> => {
		const paginationParams = this.paginationStore.toParams(clearResults);

		const result = await listQuotes({
			pagination: paginationParams,
			artistId: this.artistId,
		});

		runInAction(() => {
			this.quotes = result.items;

			if (paginationParams.getTotalCount)
				this.paginationStore.totalItems = result.totalCount;
		});

		return result;
	};

	@computed.struct get routeParams(): IQuoteIndexRouteParams {
		return {
			page: this.paginationStore.page,
			pageSize: this.paginationStore.pageSize,
		};
	}
	set routeParams(value: IQuoteIndexRouteParams) {
		this.paginationStore.page = value.page ?? 1;
		this.paginationStore.pageSize = value.pageSize ?? 10;
	}

	validateRouteParams = (data: any): data is IQuoteIndexRouteParams =>
		validate(data);
}
