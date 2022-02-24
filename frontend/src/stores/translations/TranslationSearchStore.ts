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
import { WordCategory } from '../../models/WordCategory';
import { PaginationStore } from '../PaginationStore';

interface ITranslationSearchRouteParams {
	page?: number;
	pageSize?: number;
	sort?: TranslationSortRule;
	query?: string;
	category?: WordCategory;
}

const translationSearchRouteParamsSchema = {
	$schema: 'http://json-schema.org/draft-07/schema#',
	properties: {
		category: {
			enum: [
				'adjectival-noun',
				'adjective',
				'adverb',
				'attributive',
				'auxiliary-verb',
				'conjunction',
				'interjection',
				'noun',
				'other',
				'postpositional-particle',
				'prefix',
				'pronoun',
				'suffix',
				'verb',
			],
			type: 'string',
		},
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
				'created-asc',
				'created-desc',
			],
			type: 'string',
		},
	},
	type: 'object',
};

const validate = ajv.compile<ITranslationSearchRouteParams>(
	translationSearchRouteParamsSchema,
);

export class TranslationSearchStore
	implements
		IStoreWithPagination<
			ITranslationSearchRouteParams,
			ISearchResultObject<ITranslationObject>
		>
{
	readonly paginationStore = new PaginationStore({ pageSize: 50 });
	@observable translations: ITranslationObject[] = [];
	@observable sort = TranslationSortRule.HeadwordAsc;
	@observable query = '';
	@observable category?: WordCategory;

	constructor() {
		makeObservable(this);
	}

	@action setSort = (value: TranslationSortRule): void => {
		this.sort = value;
	};

	@action setQuery = (value: string): void => {
		this.query = value;
	};

	clearQuery = (): void => this.setQuery('');

	@action setCategory = (value?: WordCategory): void => {
		this.category = value;
	};

	popState = false;

	clearResultsByQueryKeys: (keyof ITranslationSearchRouteParams)[] = [
		'sort',
		'query',
		'category',
	];

	updateResults = async (
		clearResults: boolean,
	): Promise<ISearchResultObject<ITranslationObject>> => {
		const paginationParams = this.paginationStore.toParams(clearResults);

		const result = await listTranslations({
			pagination: paginationParams,
			sort: this.sort,
			query: this.query,
			category: this.category,
		});

		runInAction(() => {
			this.translations = result.items;

			if (paginationParams.getTotalCount)
				this.paginationStore.totalItems = result.totalCount;
		});

		return result;
	};

	@computed.struct get routeParams(): ITranslationSearchRouteParams {
		return {
			page: this.paginationStore.page,
			pageSize: this.paginationStore.pageSize,
			sort: this.sort,
			query: this.query,
			category: this.category ? this.category : undefined,
		};
	}
	set routeParams(value: ITranslationSearchRouteParams) {
		this.paginationStore.page = value.page ?? 1;
		this.paginationStore.pageSize = value.pageSize ?? 50;
		this.sort = value.sort ?? TranslationSortRule.HeadwordAsc;
		this.query = value.query ?? '';
		this.category = value.category;
	}

	validateRouteParams = (
		data: any,
	): data is ITranslationSearchRouteParams => {
		return validate(data);
	};
}
