import { ArtistSortRule } from '@/models/artists/ArtistSortRule';
import { ArtistType } from '@/models/artists/ArtistType';

export interface IArtistSearchRouteParams {
	page?: number;
	pageSize?: number;
	sort?: ArtistSortRule;
	query?: string;
	artistType?: ArtistType;
}
