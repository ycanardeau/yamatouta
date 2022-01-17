import axios from 'axios';

import { ISearchResultObject } from '../dto/ISearchResultObject';
import { IArtistObject } from '../dto/artists/IArtistObject';
import { ArtistType } from '../models/ArtistType';
import { IPaginationParams } from '../stores/PaginationStore';

export const listArtists = async (params: {
	pagination: IPaginationParams;
}): Promise<ISearchResultObject<IArtistObject>> => {
	const { pagination } = params;

	const response = await axios.get<ISearchResultObject<IArtistObject>>(
		'/artists',
		{ params: { ...pagination } },
	);

	return response.data;
};

export const getArtist = async (artistId: number): Promise<IArtistObject> => {
	const response = await axios.get<IArtistObject>(`/artists/${artistId}`);

	return response.data;
};

export const createArtist = async (params: {
	name: string;
	artistType: ArtistType;
}): Promise<IArtistObject> => {
	const { name, artistType } = params;

	const response = await axios.post<IArtistObject>('/artists', {
		name,
		artistType,
	});

	return response.data;
};
