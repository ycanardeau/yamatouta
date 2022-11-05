import { Link } from '@/components/Link';
import { IArtistLinkDto } from '@/dto/ILinkDto';
import {
	EuiDescriptionListDescription,
	EuiDescriptionListTitle,
} from '@elastic/eui';
import React from 'react';

interface ArtistLinkListProps {
	artistLinks: IArtistLinkDto[];
}

const ArtistLinkList = ({
	artistLinks,
}: ArtistLinkListProps): React.ReactElement => {
	return (
		<>
			{artistLinks.map((artistLink, index) => (
				<React.Fragment key={artistLink.id}>
					{index > 0 && <br />}
					<Link to={`/artists/${artistLink.relatedArtist.id}`}>
						{artistLink.relatedArtist.name}
					</Link>
				</React.Fragment>
			))}
		</>
	);
};

interface ArtistLinkDescriptionListProps {
	title: string;
	artistLinks: IArtistLinkDto[];
}

export const ArtistLinkDescriptionList = ({
	title,
	artistLinks,
}: ArtistLinkDescriptionListProps): React.ReactElement => {
	return (
		<>
			<EuiDescriptionListTitle>{title}</EuiDescriptionListTitle>
			<EuiDescriptionListDescription>
				<ArtistLinkList artistLinks={artistLinks} />
			</EuiDescriptionListDescription>
		</>
	);
};
