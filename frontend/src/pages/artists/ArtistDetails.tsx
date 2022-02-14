import React from 'react';
import { Navigate, Route, Routes, useParams } from 'react-router-dom';

import { getArtist } from '../../api/ArtistApi';
import lazyWithRetry from '../../components/lazyWithRetry';
import { IArtistObject } from '../../dto/artists/IArtistObject';
import { ArtistDetailsStore } from '../../stores/artists/ArtistDetailsStore';

const ArtistQuotes = lazyWithRetry(() => import('./ArtistQuotes'));

interface ArtistDetailsLayoutProps {
	artist: IArtistObject;
	store: ArtistDetailsStore;
}

const ArtistDetailsLayout = ({
	artist,
	store,
}: ArtistDetailsLayoutProps): React.ReactElement => {
	return (
		<Routes>
			<Route
				path=""
				element={
					<Navigate
						to={`/artists/${artist.id}/quotes`}
						replace
					/> /* TODO: Create ArtistDetails. */
				}
			/>
			<Route
				path="quotes"
				element={<ArtistQuotes artist={artist} store={store} />}
			/>
		</Routes>
	);
};

const ArtistDetails = (): React.ReactElement | null => {
	const [model, setModel] = React.useState<
		{ artist: IArtistObject; store: ArtistDetailsStore } | undefined
	>();

	const { artistId } = useParams();

	React.useEffect(() => {
		getArtist(Number(artistId)).then((artist) =>
			setModel({
				artist: artist,
				store: new ArtistDetailsStore(artist.id),
			}),
		);
	}, [artistId]);

	return model ? (
		<ArtistDetailsLayout artist={model.artist} store={model.store} />
	) : null;
};

export default ArtistDetails;
