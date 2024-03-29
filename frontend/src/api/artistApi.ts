import { IArtistDto } from '@/dto/IArtistDto';
import { IRevisionDto } from '@/dto/IRevisionDto';
import { ISearchResultDto } from '@/dto/ISearchResultDto';
import { ArtistOptionalField } from '@/models/artists/ArtistOptionalField';
import { ArtistSortRule } from '@/models/artists/ArtistSortRule';
import { ArtistType } from '@/models/artists/ArtistType';
import { IArtistUpdateParams } from '@/models/artists/IArtistUpdateParams';
import { IPaginationParams } from '@/stores/PaginationStore';
import axios from 'axios';

class ArtistApi {
	create = async ({
		name,
		artistType,
		webLinks,
	}: IArtistUpdateParams): Promise<IArtistDto> => {
		const response = await axios.post<IArtistDto>('/artists/create', {
			id: 0,
			name,
			artistType,
			webLinks,
		});

		return response.data;
	};

	delete = async ({ id }: { id: number }): Promise<void> => {
		await axios.delete<void>(`/artists/delete`, { data: { id: id } });
	};

	get = async ({
		id,
		fields,
	}: {
		id: number;
		fields?: ArtistOptionalField[];
	}): Promise<IArtistDto> => {
		const response = await axios.get<IArtistDto>(`/artists/get`, {
			params: { id: id, fields: fields },
		});

		return response.data;
	};

	list = async ({
		pagination,
		sort,
		query,
		artistType,
	}: {
		pagination: IPaginationParams;
		sort?: ArtistSortRule;
		query?: string;
		artistType?: ArtistType;
	}): Promise<ISearchResultDto<IArtistDto>> => {
		const response = await axios.get<ISearchResultDto<IArtistDto>>(
			'/artists/list',
			{ params: { ...pagination, sort, query, artistType } },
		);

		return response.data;
	};

	listRevisions = async ({
		id,
	}: {
		id: number;
	}): Promise<ISearchResultDto<IRevisionDto>> => {
		const response = await axios.get<ISearchResultDto<IRevisionDto>>(
			`/artists/list-revisions`,
			{ params: { id: id } },
		);

		return response.data;
	};

	update = async ({
		id,
		name,
		artistType,
		webLinks,
	}: IArtistUpdateParams): Promise<IArtistDto> => {
		const response = await axios.post<IArtistDto>(`/artists/update`, {
			id: id,
			name,
			artistType,
			webLinks,
		});

		return response.data;
	};
}

export const artistApi = new ArtistApi();
