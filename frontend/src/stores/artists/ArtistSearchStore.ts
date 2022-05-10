import { computed, makeObservable, observable, runInAction } from 'mobx';

import { ajv } from '../../ajv';
import { listArtists } from '../../api/ArtistApi';
import { IStoreWithPagination } from '../../components/useStoreWithPagination';
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
	implements IStoreWithPagination<IArtistSearchRouteParams>
{
	readonly pagination = new PaginationStore({ pageSize: 50 });
	@observable artists: IArtistObject[] = [];

	constructor() {
		makeObservable(this);
	}

	popState = false;

	clearResultsByQueryKeys: (keyof IArtistSearchRouteParams)[] = ['pageSize'];

	private pauseNotifications = false;

	updateResults = async (clearResults: boolean): Promise<void> => {
		if (this.pauseNotifications) return;

		this.pauseNotifications = true;

		try {
			const paginationParams = this.pagination.toParams(clearResults);

			const result = await listArtists({
				pagination: paginationParams,
			});

			runInAction(() => {
				this.artists = result.items;

				if (paginationParams.getTotalCount)
					this.pagination.totalItems = result.totalCount;
			});

			return;
		} finally {
			this.pauseNotifications = false;
		}
	};

	@computed.struct get routeParams(): IArtistSearchRouteParams {
		return {
			page: this.pagination.page,
			pageSize: this.pagination.pageSize,
		};
	}
	set routeParams(value: IArtistSearchRouteParams) {
		this.pagination.page = value.page ?? 1;
		this.pagination.pageSize = value.pageSize ?? 50;
	}

	validateRouteParams = (data: any): data is IArtistSearchRouteParams => {
		return validate(data);
	};
}
