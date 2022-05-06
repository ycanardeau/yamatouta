import axios from 'axios';

import { ISearchResultObject } from '../dto/ISearchResultObject';
import { IWebLinkObject } from '../dto/IWebLinkObject';
import { IArtistObject } from '../dto/artists/IArtistObject';
import { ArtistOptionalFields } from '../models/ArtistOptionalFields';
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
	fields,
}: {
	artistId: number;
	fields?: ArtistOptionalFields[];
}): Promise<IArtistObject> => {
	const response = await axios.get<IArtistObject>(`/artists/${artistId}`, {
		params: { fields: fields },
	});

	return response.data;
};

export const createArtist = async ({
	name,
	artistType,
	webLinks,
}: {
	name: string;
	artistType: ArtistType;
	webLinks: IWebLinkObject[];
}): Promise<IArtistObject> => {
	const response = await axios.post<IArtistObject>('/artists', {
		name,
		artistType,
		webLinks,
	});

	return response.data;
};

export const updateArtist = async ({
	artistId,
	name,
	artistType,
	webLinks,
}: {
	artistId: number;
	name: string;
	artistType: ArtistType;
	webLinks: IWebLinkObject[];
}): Promise<IArtistObject> => {
	const response = await axios.patch<IArtistObject>(`/artists/${artistId}`, {
		name,
		artistType,
		webLinks,
	});

	return response.data;
};

export const deleteArtist = async ({
	artistId,
}: {
	artistId: number;
}): Promise<void> => {
	await axios.delete<void>(`/artists/${artistId}`);
};
