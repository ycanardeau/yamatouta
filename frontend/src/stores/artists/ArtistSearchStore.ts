import { StoreWithPagination } from '@vocadb/route-sphere';
import {
	action,
	computed,
	makeObservable,
	observable,
	runInAction,
} from 'mobx';

import { artistApi } from '../../api/artistApi';
import { IArtistObject } from '../../dto/IArtistObject';
import { IArtistSearchRouteParams } from '../../models/artists/IArtistSearchRouteParams';
import * as validators from '../../utils/validate';
import { PaginationStore } from '../PaginationStore';

export class ArtistSearchStore
	implements StoreWithPagination<IArtistSearchRouteParams>
{
	readonly pagination = new PaginationStore({ pageSize: 50 });
	@observable artists: IArtistObject[] = [];

	constructor() {
		makeObservable(this);
	}

	popState = false;

	clearResultsByQueryKeys: (keyof IArtistSearchRouteParams)[] = ['pageSize'];

	@observable loading = false;

	@action updateResults = async (clearResults: boolean): Promise<void> => {
		if (this.loading) return;

		this.loading = true;
		this.artists = [];

		try {
			const paginationParams = this.pagination.toParams(clearResults);

			const result = await artistApi.list({
				pagination: paginationParams,
			});

			runInAction(() => {
				this.artists = result.items;

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
		return validators.artistSearchRouteParams(data);
	};

	onClearResults = (): void => {
		this.pagination.goToFirstPage();
	};
}
