import { computed, makeObservable, observable, runInAction } from 'mobx';

import { ajv } from '../../ajv';
import { listQuotes } from '../../api/QuoteApi';
import { IStoreWithPagination } from '../../components/useStoreWithPagination';
import { ISearchResultObject } from '../../dto/ISearchResultObject';
import { IQuoteObject } from '../../dto/quotes/IQuoteObject';
import { PaginationStore } from '../PaginationStore';

interface IQuoteSearchRouteParams {
	page?: number;
	pageSize?: number;
}

const quoteSearchRouteParamsSchema = {
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

const validate = ajv.compile<IQuoteSearchRouteParams>(
	quoteSearchRouteParamsSchema,
);

export class QuoteSearchStore
	implements
		IStoreWithPagination<
			IQuoteSearchRouteParams,
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

	clearResultsByQueryKeys: (keyof IQuoteSearchRouteParams)[] = [];

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

	@computed.struct get routeParams(): IQuoteSearchRouteParams {
		return {
			page: this.paginationStore.page,
			pageSize: this.paginationStore.pageSize,
		};
	}
	set routeParams(value: IQuoteSearchRouteParams) {
		this.paginationStore.page = value.page ?? 1;
		this.paginationStore.pageSize = value.pageSize ?? 10;
	}

	validateRouteParams = (data: any): data is IQuoteSearchRouteParams => {
		return validate(data);
	};
}
