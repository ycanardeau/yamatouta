import axios from 'axios';

import { IArtistObject } from '../dto/IArtistObject';
import { IRevisionObject } from '../dto/IRevisionObject';
import { ISearchResultObject } from '../dto/ISearchResultObject';
import { ArtistOptionalField } from '../models/artists/ArtistOptionalField';
import { ArtistSortRule } from '../models/artists/ArtistSortRule';
import { ArtistType } from '../models/artists/ArtistType';
import { IArtistUpdateParams } from '../models/artists/IArtistUpdateParams';
import { IPaginationParams } from '../stores/PaginationStore';

class ArtistApi {
	create = async ({
		name,
		artistType,
		webLinks,
	}: IArtistUpdateParams): Promise<IArtistObject> => {
		const response = await axios.post<IArtistObject>('/artists/create', {
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
	}): Promise<IArtistObject> => {
		const response = await axios.get<IArtistObject>(`/artists/get`, {
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
	}): Promise<ISearchResultObject<IArtistObject>> => {
		const response = await axios.get<ISearchResultObject<IArtistObject>>(
			'/artists/list',
			{ params: { ...pagination, sort, query, artistType } },
		);

		return response.data;
	};

	listRevisions = async ({
		id,
	}: {
		id: number;
	}): Promise<ISearchResultObject<IRevisionObject>> => {
		const response = await axios.get<ISearchResultObject<IRevisionObject>>(
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
	}: IArtistUpdateParams): Promise<IArtistObject> => {
		const response = await axios.post<IArtistObject>(`/artists/update`, {
			id: id,
			name,
			artistType,
			webLinks,
		});

		return response.data;
	};
}

export const artistApi = new ArtistApi();
