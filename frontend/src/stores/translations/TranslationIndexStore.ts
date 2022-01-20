import {
	action,
	computed,
	makeObservable,
	observable,
	runInAction,
} from 'mobx';

import { ajv } from '../../ajv';
import { listTranslations } from '../../api/TranslationApi';
import { IStoreWithPagination } from '../../components/useStoreWithPagination';
import { ISearchResultObject } from '../../dto/ISearchResultObject';
import { ITranslationObject } from '../../dto/translations/ITranslationObject';
import { TranslationSortRule } from '../../models/TranslationSortRule';
import { PaginationStore } from '../PaginationStore';

interface ITranslationIndexRouteParams {
	page?: number;
	pageSize?: number;
	sort?: TranslationSortRule;
	query?: string;
}

const translationIndexRouteParamsSchema = {
	$schema: 'http://json-schema.org/draft-07/schema#',
	properties: {
		page: {
			type: 'number',
		},
		pageSize: {
			type: 'number',
		},
		query: {
			type: 'string',
		},
		sort: {
			enum: [
				'headword-asc',
				'headword-desc',
				'yamatokotoba-asc',
				'yamatokotoba-desc',
			],
			type: 'string',
		},
	},
	type: 'object',
};

const validate = ajv.compile<ITranslationIndexRouteParams>(
	translationIndexRouteParamsSchema,
);

export class TranslationIndexStore
	implements
		IStoreWithPagination<
			ITranslationIndexRouteParams,
			ISearchResultObject<ITranslationObject>
		>
{
	readonly paginationStore = new PaginationStore();

	@observable translations: ITranslationObject[] = [];
	@observable sort = TranslationSortRule.HeadwordAsc;
	@observable query = '';

	constructor() {
		makeObservable(this);
	}

	popState = false;

	clearResultsByQueryKeys: (keyof ITranslationIndexRouteParams)[] = [
		'sort',
		'query',
	];

	updateResults = async (
		clearResults: boolean,
	): Promise<ISearchResultObject<ITranslationObject>> => {
		const paginationParams = this.paginationStore.toParams(clearResults);

		const result = await listTranslations({
			pagination: paginationParams,
			sort: this.sort,
			query: this.query,
		});

		runInAction(() => {
			this.translations = result.items;

			if (paginationParams.getTotalCount)
				this.paginationStore.totalItems = result.totalCount;
		});

		return result;
	};

	@computed.struct get routeParams(): ITranslationIndexRouteParams {
		return {
			page: this.paginationStore.page,
			pageSize: this.paginationStore.pageSize,
			sort: this.sort,
			query: this.query,
		};
	}
	set routeParams(value: ITranslationIndexRouteParams) {
		this.paginationStore.page = value.page ?? 1;
		this.paginationStore.pageSize = value.pageSize ?? 50;
		this.sort = value.sort ?? TranslationSortRule.HeadwordAsc;
		this.query = value.query ?? '';
	}

	validateRouteParams = (data: any): data is ITranslationIndexRouteParams =>
		validate(data);

	@action setSort = (value: TranslationSortRule): void => {
		this.sort = value;
	};
}
