import { computed, makeObservable, observable, runInAction } from 'mobx';

import { ajv } from '../../ajv';
import { listArtists } from '../../api/ArtistApi';
import { IStoreWithPagination } from '../../components/useStoreWithPagination';
import { ISearchResultObject } from '../../dto/ISearchResultObject';
import { IArtistObject } from '../../dto/artists/IArtistObject';
import { PaginationStore } from '../PaginationStore';

interface IArtistIndexRouteParams {
	page?: number;
	pageSize?: number;
}

const artistIndexRouteParamsSchema = {
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

const validate = ajv.compile<IArtistIndexRouteParams>(
	artistIndexRouteParamsSchema,
);

export class ArtistIndexStore
	implements
		IStoreWithPagination<
			IArtistIndexRouteParams,
			ISearchResultObject<IArtistObject>
		>
{
	readonly paginationStore = new PaginationStore();

	@observable artists: IArtistObject[] = [];

	constructor() {
		makeObservable(this);
	}

	popState = false;

	clearResultsByQueryKeys: (keyof IArtistIndexRouteParams)[] = [];

	updateResults = async (
		clearResults: boolean,
	): Promise<ISearchResultObject<IArtistObject>> => {
		const paginationParams = this.paginationStore.toParams(clearResults);

		const result = await listArtists({
			pagination: paginationParams,
		});

		runInAction(() => {
			this.artists = result.items;

			if (paginationParams.getTotalCount)
				this.paginationStore.totalItems = result.totalCount;
		});

		return result;
	};

	@computed.struct get routeParams(): IArtistIndexRouteParams {
		return {
			page: this.paginationStore.page,
			pageSize: this.paginationStore.pageSize,
		};
	}
	set routeParams(value: IArtistIndexRouteParams) {
		this.paginationStore.page = value.page ?? 1;
		this.paginationStore.pageSize = value.pageSize ?? 10;
	}

	validateRouteParams = (data: any): data is IArtistIndexRouteParams =>
		validate(data);
}
