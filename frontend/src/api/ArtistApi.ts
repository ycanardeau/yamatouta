import axios from 'axios';

import { config } from '../config';
import { ISearchResultDto } from '../dto/ISearchResultDto';
import { ArtistType } from '../dto/artists/ArtistType';
import { IArtistDto } from '../dto/artists/IArtistDto';
import { IPaginationParams } from '../stores/PaginationStore';

export const listArtists = async ({
	pagination,
}: {
	pagination: IPaginationParams;
}): Promise<ISearchResultDto<IArtistDto>> => {
	const response = await axios.get<ISearchResultDto<IArtistDto>>(
		`${config.apiEndpoint}/artists`,
		{ params: { ...pagination } },
	);

	return response.data;
};

export const getArtist = async (artistId: number): Promise<IArtistDto> => {
	const response = await axios.get<IArtistDto>(
		`${config.apiEndpoint}/artists/${artistId}`,
	);

	return response.data;
};

export const createArtist = async ({
	name,
	artistType,
}: {
	name: string;
	artistType: ArtistType;
}): Promise<IArtistDto> => {
	const response = await axios.post<IArtistDto>(
		`${config.apiEndpoint}/artists`,
		{
			name,
			artistType,
		},
	);

	return response.data;
};
