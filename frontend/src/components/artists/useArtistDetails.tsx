import { artistApi } from '@/api/artistApi';
import { IArtistObject } from '@/dto/IArtistObject';
import { ArtistOptionalField } from '@/models/artists/ArtistOptionalField';
import React from 'react';
import { useParams } from 'react-router-dom';

export const useArtistDetails = <T,>(
	factory: (artist: IArtistObject) => T,
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
