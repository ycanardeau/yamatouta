import { artistApi } from '@/api/artistApi';
import { IArtistDto } from '@/dto/IArtistDto';
import { ArtistOptionalField } from '@/models/artists/ArtistOptionalField';
import React from 'react';
import { useParams } from 'react-router-dom';

export const useArtistDetails = <T,>(
	factory: (artist: IArtistDto) => T,
): [T | undefined] => {
	const { id } = useParams();

	const [artist, setArtist] = React.useState<T>();

	React.useEffect(() => {
		artistApi
			.get({
				id: Number(id),
				fields: Object.values(ArtistOptionalField),
			})
			.then((artist) => setArtist(factory(artist)));
	}, [id, factory]);

	return [artist];
};
