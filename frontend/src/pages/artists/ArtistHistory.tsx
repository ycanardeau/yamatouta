import { EuiCommentList } from '@elastic/eui';
import React from 'react';

import { listArtistRevisions } from '../../api/RevisionApi';
import RevisionComment from '../../components/revisions/RevisionComment';
import { IArtistObject } from '../../dto/artists/IArtistObject';
import { IRevisionObject } from '../../dto/revisions/IRevisionObject';

interface LayoutProps {
	revisions: IRevisionObject[];
}

const Layout = ({ revisions }: LayoutProps): React.ReactElement => {
	return (
		<EuiCommentList>
			{revisions.map((revision, index) => (
				<RevisionComment key={index} revision={revision} />
			))}
		</EuiCommentList>
	);
};

interface ArtistHistoryProps {
	artist: IArtistObject;
}

const ArtistHistory = ({
	artist,
}: ArtistHistoryProps): React.ReactElement | null => {
	const [revisions, setRevisions] = React.useState<IRevisionObject[]>();

	React.useEffect(() => {
		listArtistRevisions({ artistId: artist.id }).then((result) =>
			setRevisions(result.items),
		);
	}, [artist]);

	return revisions ? <Layout revisions={revisions} /> : null;
};

export default ArtistHistory;
