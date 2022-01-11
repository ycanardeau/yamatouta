import { computed, makeObservable, observable, runInAction } from 'mobx';

import { ajv } from '../../ajv';
import { listTranslations } from '../../api/TranslationApi';
import { IStoreWithPagination } from '../../components/useStoreWithPagination';
import { ISearchResultObject } from '../../dto/ISearchResultObject';
import { ITranslationObject } from '../../dto/translations/ITranslationObject';
import { PaginationStore } from '../PaginationStore';

interface ITranslationIndexRouteParams {
	page?: number;
	pageSize?: number;
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

	constructor() {
		makeObservable(this);
	}

	popState = false;

	clearResultsByQueryKeys: (keyof ITranslationIndexRouteParams)[] = [];

	updateResults = async (
		clearResults: boolean,
	): Promise<ISearchResultObject<ITranslationObject>> => {
		const paginationParams = this.paginationStore.toParams(clearResults);

		const result = await listTranslations({
			pagination: paginationParams,
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
		};
	}
	set routeParams(value: ITranslationIndexRouteParams) {
		this.paginationStore.page = value.page ?? 1;
		this.paginationStore.pageSize = value.pageSize ?? 50;
	}

	validateRouteParams = (data: any): data is ITranslationIndexRouteParams =>
		validate(data);
}
