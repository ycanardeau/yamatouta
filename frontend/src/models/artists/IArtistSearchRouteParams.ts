import { ArtistSortRule } from './ArtistSortRule';
import { ArtistType } from './ArtistType';

export interface IArtistSearchRouteParams {
	page?: number;
	pageSize?: number;
	sort?: ArtistSortRule;
	query?: string;
	artistType?: ArtistType;
}
