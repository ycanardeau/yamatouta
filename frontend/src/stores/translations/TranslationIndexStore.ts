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

	constructor() {
		makeObservable(this);
	}

	popState = false;

	clearResultsByQueryKeys: (keyof ITranslationIndexRouteParams)[] = ['sort'];

	updateResults = async (
		clearResults: boolean,
	): Promise<ISearchResultObject<ITranslationObject>> => {
		const paginationParams = this.paginationStore.toParams(clearResults);

		const result = await listTranslations({
			pagination: paginationParams,
			sort: this.sort,
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
		};
	}
	set routeParams(value: ITranslationIndexRouteParams) {
		this.paginationStore.page = value.page ?? 1;
		this.paginationStore.pageSize = value.pageSize ?? 50;
		this.sort = value.sort ?? TranslationSortRule.HeadwordAsc;
	}

	validateRouteParams = (data: any): data is ITranslationIndexRouteParams =>
		validate(data);

	@action setSort = (value: TranslationSortRule): void => {
		this.sort = value;
	};
}
