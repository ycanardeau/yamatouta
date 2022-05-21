import { StoreWithPagination } from '@vocadb/route-sphere';
import { computed, makeObservable, observable, runInAction } from 'mobx';

import { ajv } from '../../ajv';
import { listQuotes } from '../../api/QuoteApi';
import { IQuoteObject } from '../../dto/IQuoteObject';
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
	implements StoreWithPagination<IQuoteSearchRouteParams>
{
	readonly pagination = new PaginationStore({ pageSize: 50 });
	@observable quotes: IQuoteObject[] = [];
	@observable artistId?: number;

	constructor() {
		makeObservable(this);
	}

	popState = false;

	clearResultsByQueryKeys: (keyof IQuoteSearchRouteParams)[] = ['pageSize'];

	private pauseNotifications = false;

	updateResults = async (clearResults: boolean): Promise<void> => {
		if (this.pauseNotifications) return;

		this.pauseNotifications = true;

		try {
			const paginationParams = this.pagination.toParams(clearResults);

			const result = await listQuotes({
				pagination: paginationParams,
				artistId: this.artistId,
			});

			runInAction(() => {
				this.quotes = result.items;

				if (paginationParams.getTotalCount)
					this.pagination.totalItems = result.totalCount;
			});

			return;
		} finally {
			this.pauseNotifications = false;
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
		return validate(data);
	};

	onClearResults = (): void => {
		this.pagination.goToFirstPage();
	};
}
