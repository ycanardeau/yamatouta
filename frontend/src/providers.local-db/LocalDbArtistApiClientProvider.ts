import { IArtistDto } from '@/dto/IArtistDto';
import { IRevisionDto } from '@/dto/IRevisionDto';
import { ISearchResultDto } from '@/dto/ISearchResultDto';
import { EntryType } from '@/models/EntryType';
import { ArtistOptionalField } from '@/models/artists/ArtistOptionalField';
import { ArtistSortRule } from '@/models/artists/ArtistSortRule';
import { ArtistType } from '@/models/artists/ArtistType';
import { IArtistUpdateParams } from '@/models/artists/IArtistUpdateParams';
import { IArtistApiClientProvider } from '@/providers.abstractions/IArtistApiClientProvider';
import { IPaginationParams } from '@/stores/PaginationStore';

export class LocalDbArtistApiClientProvider
	implements IArtistApiClientProvider
{
	async create({
		name,
		artistType,
		webLinks,
	}: IArtistUpdateParams): Promise<IArtistDto> {
		throw new Error('Method not implemented.');
	}

	async delete({ id }: { id: number }): Promise<void> {
		throw new Error('Method not implemented.');
	}

	async get({
		id,
		fields,
	}: {
		id: number;
		fields?: ArtistOptionalField[];
	}): Promise<IArtistDto> {
		return {
			id: 0,
			entryType: EntryType.Artist,
			artistType: ArtistType.Person,
			name: 'Artist 1',
			avatarUrl: '',
			webLinks: [],
		};
	}

	async list({
		pagination,
		sort,
		query,
		artistType,
	}: {
		pagination: IPaginationParams;
		sort?: ArtistSortRule;
		query?: string;
		artistType?: ArtistType;
	}): Promise<ISearchResultDto<IArtistDto>> {
		return {
			items: [
				{
					id: 0,
					entryType: EntryType.Artist,
					artistType: ArtistType.Person,
					name: 'Artist 1',
					avatarUrl: '',
					webLinks: [],
				},
			],
			totalCount: 1,
		};
	}

	async listRevisions({
		id,
	}: {
		id: number;
	}): Promise<ISearchResultDto<IRevisionDto>> {
		return {
			items: [],
			totalCount: 0,
		};
	}

	async update({
		id,
		name,
		artistType,
		webLinks,
	}: IArtistUpdateParams): Promise<IArtistDto> {
		throw new Error('Method not implemented.');
	}
}
