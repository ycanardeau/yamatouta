import { computed, makeObservable, observable, runInAction } from 'mobx';

import { ajv } from '../../ajv';
import { listArtists } from '../../api/ArtistApi';
import { IStoreWithPagination } from '../../components/useStoreWithPagination';
import { ISearchResultDto } from '../../dto/ISearchResultDto';
import { IArtistDto } from '../../dto/artists/IArtistDto';
import { CreateArtistDialogStore } from '../CreateArtistDialogStore';
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
			ISearchResultDto<IArtistDto>
		>
{
	readonly paginationStore = new PaginationStore();
	readonly createArtistDialogStore = new CreateArtistDialogStore();

	@observable artists: IArtistDto[] = [];

	constructor() {
		makeObservable(this);
	}

	popState = false;

	clearResultsByQueryKeys: (keyof IArtistIndexRouteParams)[] = [];

	updateResults = async (
		clearResults: boolean,
	): Promise<ISearchResultDto<IArtistDto>> => {
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
