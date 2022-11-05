import { artistApi } from '@/api/artistApi';
import { IArtistObject } from '@/dto/IArtistObject';
import { ArtistSortRule } from '@/models/artists/ArtistSortRule';
import { ArtistType } from '@/models/artists/ArtistType';
import { IArtistSearchRouteParams } from '@/models/artists/IArtistSearchRouteParams';
import { PaginationStore } from '@/stores/PaginationStore';
import * as validators from '@/utils/validate';
import { StoreWithPagination } from '@vocadb/route-sphere';
import {
	action,
	computed,
	makeObservable,
	observable,
	runInAction,
} from 'mobx';

export class ArtistSearchStore
	implements StoreWithPagination<IArtistSearchRouteParams>
{
	readonly pagination = new PaginationStore({ pageSize: 50 });
	@observable artists: IArtistObject[] = [];
	@observable sort = ArtistSortRule.CreatedAsc;
	@observable query = '';
	@observable submittedQuery = '';
	@observable artistType: ArtistType | '' = '';

	constructor() {
		makeObservable(this);
	}

	@action setSort = (value: ArtistSortRule): void => {
		this.sort = value;
	};

	@action setQuery = (value: string): void => {
		this.query = value;
	};

	@action setSubmittedQuery = (value: string): void => {
		this.submittedQuery = value;
		this.query = value;
	};

	@action setArtistType = (value: ArtistType | ''): void => {
		this.artistType = value;
	};

	popState = false;

	clearResultsByQueryKeys: (keyof IArtistSearchRouteParams)[] = [
		'pageSize',
		'sort',
		'query',
		'artistType',
	];

	@observable loading = false;

	@action updateResults = async (clearResults: boolean): Promise<void> => {
		if (this.loading) return;

		this.loading = true;
		this.artists = [];

		try {
			const paginationParams = this.pagination.toParams(clearResults);

			const result = await artistApi.list({
				pagination: paginationParams,
				sort: this.sort,
				query: this.submittedQuery,
				artistType: this.artistType ? this.artistType : undefined,
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
			sort: this.sort,
			query: this.submittedQuery,
			artistType: this.artistType ? this.artistType : undefined,
		};
	}
	set routeParams(value: IArtistSearchRouteParams) {
		this.pagination.page = value.page ?? 1;
		this.pagination.pageSize = value.pageSize ?? 50;
		this.sort = value.sort ?? ArtistSortRule.CreatedAsc;
		this.setSubmittedQuery(value.query ?? '');
		this.artistType = value.artistType ?? '';
	}

	validateRouteParams = (data: any): data is IArtistSearchRouteParams => {
		return validators.artistSearchRouteParams(data);
	};

	onClearResults = (): void => {
		this.pagination.goToFirstPage();
	};

	@action submit = (): void => {
		this.submittedQuery = this.query;
	};
}
