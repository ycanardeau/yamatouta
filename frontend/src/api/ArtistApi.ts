import axios from 'axios';

import { ISearchResultObject } from '../dto/ISearchResultObject';
import { IArtistObject } from '../dto/artists/IArtistObject';
import { ArtistType } from '../models/ArtistType';
import { IPaginationParams } from '../stores/PaginationStore';

export const listArtists = async ({
	pagination,
	query,
}: {
	pagination: IPaginationParams;
	query?: string;
}): Promise<ISearchResultObject<IArtistObject>> => {
	const response = await axios.get<ISearchResultObject<IArtistObject>>(
		'/artists',
		{ params: { ...pagination, query } },
	);

	return response.data;
};

export const getArtist = async ({
	artistId,
}: {
	artistId: number;
}): Promise<IArtistObject> => {
	const response = await axios.get<IArtistObject>(`/artists/${artistId}`);

	return response.data;
};

export const createArtist = async ({
	name,
	artistType,
}: {
	name: string;
	artistType: ArtistType;
}): Promise<IArtistObject> => {
	const response = await axios.post<IArtistObject>('/artists', {
		name,
		artistType,
	});

	return response.data;
};

export const updateArtist = async ({
	artistId,
	name,
	artistType,
}: {
	artistId: number;
	name: string;
	artistType: ArtistType;
}): Promise<IArtistObject> => {
	const response = await axios.patch<IArtistObject>(`/artists/${artistId}`, {
		name,
		artistType,
	});

	return response.data;
};
