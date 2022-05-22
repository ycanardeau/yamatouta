import React from 'react';

import ArtistEditForm from '../../components/artists/ArtistEditForm';
import ArtistPage from '../../components/artists/ArtistPage';
import { useArtistDetails } from '../../components/artists/useArtistDetails';
import { useYamatoutaTitle } from '../../components/useYamatoutaTitle';
import { IArtistObject } from '../../dto/IArtistObject';

interface LayoutProps {
	artist: IArtistObject;
}

const Layout = ({ artist }: LayoutProps): React.ReactElement => {
	const title = artist.name;

	useYamatoutaTitle(title, true);

	return (
		<ArtistPage artist={artist} pageHeaderProps={{ pageTitle: title }}>
			<ArtistEditForm artist={artist} />
		</ArtistPage>
	);
};

const ArtistEdit = (): React.ReactElement | null => {
	const [artist] = useArtistDetails(
		React.useCallback((artist) => artist, []),
	);

	return artist ? <Layout artist={artist} /> : null;
};

export default ArtistEdit;
