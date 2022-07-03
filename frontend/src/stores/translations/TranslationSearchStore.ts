import { StoreWithPagination } from '@vocadb/route-sphere';
import {
	action,
	computed,
	makeObservable,
	observable,
	runInAction,
} from 'mobx';

import { translationApi } from '../../api/translationApi';
import { ITranslationObject } from '../../dto/ITranslationObject';
import { ITranslationSearchRouteParams } from '../../models/translations/ITranslationSearchRouteParams';
import { TranslationSortRule } from '../../models/translations/TranslationSortRule';
import { WordCategory } from '../../models/translations/WordCategory';
import * as validators from '../../utils/validate';
import { PaginationStore } from '../PaginationStore';

export class TranslationSearchStore
	implements StoreWithPagination<ITranslationSearchRouteParams>
{
	readonly pagination = new PaginationStore({ pageSize: 50 });
	@observable translations: ITranslationObject[] = [];
	@observable sort = TranslationSortRule.HeadwordAsc;
	@observable query = '';
	@observable submittedQuery = '';
	@observable category: WordCategory | '' = '';

	constructor() {
		makeObservable(this);
	}

	@computed get isSortedByHeadword(): boolean {
		return (
			this.sort === TranslationSortRule.HeadwordAsc ||
			this.sort === TranslationSortRule.HeadwordDesc
		);
	}

	@computed get isSortedByYamatokotoba(): boolean {
		return (
			this.sort === TranslationSortRule.YamatokotobaAsc ||
			this.sort === TranslationSortRule.YamatokotobaDesc
		);
	}

	@action setSort = (value: TranslationSortRule): void => {
		this.sort = value;
	};

	@action toggleSortByHeadword = (): void => {
		this.sort =
			this.sort === TranslationSortRule.HeadwordAsc
				? TranslationSortRule.HeadwordDesc
				: TranslationSortRule.HeadwordAsc;
	};

	@action toggleSortByYamatokotoba = (): void => {
		this.sort =
			this.sort === TranslationSortRule.YamatokotobaAsc
				? TranslationSortRule.YamatokotobaDesc
				: TranslationSortRule.YamatokotobaAsc;
	};

	@action setQuery = (value: string): void => {
		this.query = value;
	};

	@action setSubmittedQuery = (value: string): void => {
		this.submittedQuery = value;
		this.query = value;
	};

	@action setCategory = (value: WordCategory | ''): void => {
		this.category = value;
	};

	popState = false;

	clearResultsByQueryKeys: (keyof ITranslationSearchRouteParams)[] = [
		'pageSize',
		'sort',
		'query',
		'category',
	];

	@observable loading = false;

	@action updateResults = async (clearResults: boolean): Promise<void> => {
		if (this.loading) return;

		this.loading = true;
		this.translations = [];

		try {
			const paginationParams = this.pagination.toParams(clearResults);

			const result = await translationApi.list({
				pagination: paginationParams,
				sort: this.sort,
				query: this.submittedQuery,
				category: this.category ? this.category : undefined,
			});

			runInAction(() => {
				this.translations = result.items;

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

	@computed.struct get routeParams(): ITranslationSearchRouteParams {
		return {
			page: this.pagination.page,
			pageSize: this.pagination.pageSize,
			sort: this.sort,
			query: this.submittedQuery,
			category: this.category ? this.category : undefined,
		};
	}
	set routeParams(value: ITranslationSearchRouteParams) {
		this.pagination.page = value.page ?? 1;
		this.pagination.pageSize = value.pageSize ?? 50;
		this.sort = value.sort ?? TranslationSortRule.HeadwordAsc;
		this.setSubmittedQuery(value.query ?? '');
		this.category = value.category ?? '';
	}

	validateRouteParams = (
		data: any,
	): data is ITranslationSearchRouteParams => {
		return validators.translationSearchRouteParams(data);
	};

	onClearResults = (): void => {
		this.pagination.goToFirstPage();
	};

	@action submit = (): void => {
		this.submittedQuery = this.query;
	};
}
