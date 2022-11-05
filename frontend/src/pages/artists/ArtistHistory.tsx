import { artistApi } from '@/api/artistApi';
import { ArtistPage } from '@/components/artists/ArtistPage';
import { useArtistDetails } from '@/components/artists/useArtistDetails';
import { RevisionComment } from '@/components/revisions/RevisionComment';
import { useYamatoutaTitle } from '@/components/useYamatoutaTitle';
import { IArtistDto } from '@/dto/IArtistDto';
import { IRevisionDto } from '@/dto/IRevisionDto';
import { EuiCommentList } from '@elastic/eui';
import React from 'react';

interface LayoutProps {
	artist: IArtistDto;
	revisions: IRevisionDto[];
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

	const [revisions, setRevisions] = React.useState<IRevisionDto[]>();

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
