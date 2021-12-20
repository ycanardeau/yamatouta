import axios from 'axios';

import config from '../config';
import { ISearchResultObject } from '../dto/ISearchResultObject';
import { ArtistType } from '../dto/artists/ArtistType';
import { IArtistObject } from '../dto/artists/IArtistObject';
import { IPaginationParams } from '../stores/PaginationStore';

export const listArtists = async (params: {
	pagination: IPaginationParams;
}): Promise<ISearchResultObject<IArtistObject>> => {
	const { pagination } = params;

	const response = await axios.get<ISearchResultObject<IArtistObject>>(
		`${config.apiEndpoint}/artists`,
		{ params: { ...pagination } },
	);

	return response.data;
};

export const getArtist = async (artistId: number): Promise<IArtistObject> => {
	const response = await axios.get<IArtistObject>(
		`${config.apiEndpoint}/artists/${artistId}`,
	);

	return response.data;
};

export const createArtist = async (params: {
	name: string;
	artistType: ArtistType;
}): Promise<IArtistObject> => {
	const { name, artistType } = params;

	const response = await axios.post<IArtistObject>(
		`${config.apiEndpoint}/artists`,
		{
			name,
			artistType,
		},
	);

	return response.data;
};
