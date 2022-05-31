import { EuiCommentList } from '@elastic/eui';
import React from 'react';

import { artistApi } from '../../api/artistApi';
import { ArtistPage } from '../../components/artists/ArtistPage';
import { useArtistDetails } from '../../components/artists/useArtistDetails';
import { RevisionComment } from '../../components/revisions/RevisionComment';
import { useYamatoutaTitle } from '../../components/useYamatoutaTitle';
import { IArtistObject } from '../../dto/IArtistObject';
import { IRevisionObject } from '../../dto/IRevisionObject';

interface LayoutProps {
	artist: IArtistObject;
	revisions: IRevisionObject[];
}

const Layout = ({ artist, revisions }: LayoutProps): React.ReactElement => {
	const title = artist.name;

	useYamatoutaTitle(title, true);

	return (
		<ArtistPage artist={artist} pageHeaderProps={{ pageTitle: title }}>
			<EuiCommentList>
				{revisions.map((revision, index) => (
					<RevisionComment revision={revision} key={index} />
				))}
			</EuiCommentList>
		</ArtistPage>
	);
};

const ArtistHistory = (): React.ReactElement | null => {
	const [artist] = useArtistDetails(
		React.useCallback((artist) => artist, []),
	);

	const [revisions, setRevisions] = React.useState<IRevisionObject[]>();

	React.useEffect(() => {
		if (!artist) return;

		artistApi
			.listRevisions({ id: artist.id })
			.then((result) => setRevisions(result.items));
	}, [artist]);

	return artist && revisions ? (
		<Layout artist={artist} revisions={revisions} />
	) : null;
};

export default ArtistHistory;
