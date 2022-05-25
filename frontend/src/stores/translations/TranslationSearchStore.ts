import { StoreWithPagination } from '@vocadb/route-sphere';
import {
	action,
	computed,
	makeObservable,
	observable,
	runInAction,
} from 'mobx';

import { ajv } from '../../ajv';
import { translationApi } from '../../api/translationApi';
import { ITranslationObject } from '../../dto/ITranslationObject';
import { TranslationSortRule } from '../../models/translations/TranslationSortRule';
import { WordCategory } from '../../models/translations/WordCategory';
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
				'AdjectivalNoun',
				'Adjective',
				'Adverb',
				'Attributive',
				'AuxiliaryVerb',
				'Conjunction',
				'Interjection',
				'Noun',
				'Other',
				'PostpositionalParticle',
				'Prefix',
				'Pronoun',
				'Suffix',
				'Unspecified',
				'Verb',
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
				'CreatedAsc',
				'CreatedDesc',
				'HeadwordAsc',
				'HeadwordDesc',
				'UpdatedAsc',
				'UpdatedDesc',
				'YamatokotobaAsc',
				'YamatokotobaDesc',
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
	implements StoreWithPagination<ITranslationSearchRouteParams>
{
	readonly pagination = new PaginationStore({ pageSize: 50 });
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
		'pageSize',
		'sort',
		'query',
		'category',
	];

	private pauseNotifications = false;

	updateResults = async (clearResults: boolean): Promise<void> => {
		if (this.pauseNotifications) return;

		this.pauseNotifications = true;

		try {
			const paginationParams = this.pagination.toParams(clearResults);

			const result = await translationApi.list({
				pagination: paginationParams,
				sort: this.sort,
				query: this.query,
				category: this.category,
			});

			runInAction(() => {
				this.translations = result.items;

				if (paginationParams.getTotalCount)
					this.pagination.totalItems = result.totalCount;
			});

			return;
		} finally {
			this.pauseNotifications = false;
		}
	};

	@computed.struct get routeParams(): ITranslationSearchRouteParams {
		return {
			page: this.pagination.page,
			pageSize: this.pagination.pageSize,
			sort: this.sort,
			query: this.query,
			category: this.category ? this.category : undefined,
		};
	}
	set routeParams(value: ITranslationSearchRouteParams) {
		this.pagination.page = value.page ?? 1;
		this.pagination.pageSize = value.pageSize ?? 50;
		this.sort = value.sort ?? TranslationSortRule.HeadwordAsc;
		this.query = value.query ?? '';
		this.category = value.category;
	}

	validateRouteParams = (
		data: any,
	): data is ITranslationSearchRouteParams => {
		return validate(data);
	};

	onClearResults = (): void => {
		this.pagination.goToFirstPage();
	};
}
