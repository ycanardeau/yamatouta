import {
	EuiDescriptionListDescription,
	EuiDescriptionListTitle,
} from '@elastic/eui';
import React from 'react';

import { IArtistLinkObject } from '../dto/ILinkObject';
import { Link } from './Link';

interface ArtistLinkListProps {
	artistLinks: IArtistLinkObject[];
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
	artistLinks: IArtistLinkObject[];
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
