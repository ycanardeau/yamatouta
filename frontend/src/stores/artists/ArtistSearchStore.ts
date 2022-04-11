import { computed, makeObservable, observable, runInAction } from 'mobx';

import { ajv } from '../../ajv';
import { listArtists } from '../../api/ArtistApi';
import { IStoreWithPagination } from '../../components/useStoreWithPagination';
import { ISearchResultObject } from '../../dto/ISearchResultObject';
import { IArtistObject } from '../../dto/artists/IArtistObject';
import { PaginationStore } from '../PaginationStore';

interface IArtistSearchRouteParams {
	page?: number;
	pageSize?: number;
}

const artistSearchRouteParamsSchema = {
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

const validate = ajv.compile<IArtistSearchRouteParams>(
	artistSearchRouteParamsSchema,
);

export class ArtistSearchStore
	implements
		IStoreWithPagination<
			IArtistSearchRouteParams,
			ISearchResultObject<IArtistObject>
		>
{
	readonly paginationStore = new PaginationStore({ pageSize: 50 });
	@observable artists: IArtistObject[] = [];

	constructor() {
		makeObservable(this);
	}

	popState = false;

	clearResultsByQueryKeys: (keyof IArtistSearchRouteParams)[] = ['pageSize'];

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

	@computed.struct get routeParams(): IArtistSearchRouteParams {
		return {
			page: this.paginationStore.page,
			pageSize: this.paginationStore.pageSize,
		};
	}
	set routeParams(value: IArtistSearchRouteParams) {
		this.paginationStore.page = value.page ?? 1;
		this.paginationStore.pageSize = value.pageSize ?? 50;
	}

	validateRouteParams = (data: any): data is IArtistSearchRouteParams => {
		return validate(data);
	};
}
