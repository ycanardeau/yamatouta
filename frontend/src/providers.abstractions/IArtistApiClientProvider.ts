import { IArtistDto } from '@/dto/IArtistDto';
import { IRevisionDto } from '@/dto/IRevisionDto';
import { ISearchResultDto } from '@/dto/ISearchResultDto';
import { ArtistOptionalField } from '@/models/artists/ArtistOptionalField';
import { ArtistSortRule } from '@/models/artists/ArtistSortRule';
import { ArtistType } from '@/models/artists/ArtistType';
import { IArtistUpdateParams } from '@/models/artists/IArtistUpdateParams';
import { IPaginationParams } from '@/stores/PaginationStore';

export interface IArtistApiClientProvider {
	create(request: IArtistUpdateParams): Promise<IArtistDto>;
	delete(request: { id: number }): Promise<void>;
	get(request: {
		id: number;
		fields?: ArtistOptionalField[];
	}): Promise<IArtistDto>;
	list(request: {
		pagination: IPaginationParams;
		sort?: ArtistSortRule;
		query?: string;
		artistType?: ArtistType;
	}): Promise<ISearchResultDto<IArtistDto>>;
	listRevisions(request: {
		id: number;
	}): Promise<ISearchResultDto<IRevisionDto>>;
	update(request: IArtistUpdateParams): Promise<IArtistDto>;
}
