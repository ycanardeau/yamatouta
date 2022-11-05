import { WebLinkDescriptionList } from '@/components/WebLinkDescriptionList';
import { ArtistDetailsStore } from '@/stores/artists/ArtistDetailsStore';
import {
	EuiDescriptionList,
	EuiDescriptionListDescription,
	EuiDescriptionListTitle,
} from '@elastic/eui';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface ArtistBasicInfoProps {
	artistDetailsStore: ArtistDetailsStore;
}

const ArtistBasicInfo = ({
	artistDetailsStore,
}: ArtistBasicInfoProps): React.ReactElement => {
	const { t } = useTranslation();

	const artist = artistDetailsStore.artist;

	return (
		<div style={{ maxWidth: '400px' }}>
			<EuiDescriptionList type="column" compressed>
				<EuiDescriptionListTitle>
					{t('artists.name')}
				</EuiDescriptionListTitle>
				<EuiDescriptionListDescription>
					{artist.name}
				</EuiDescriptionListDescription>

				<EuiDescriptionListTitle>
					{t('artists.artistType')}
				</EuiDescriptionListTitle>
				<EuiDescriptionListDescription>
					{t(`artistTypeNames.${artist.artistType}`)}
				</EuiDescriptionListDescription>

				{artist.webLinks.length > 0 && (
					<WebLinkDescriptionList webLinks={artist.webLinks} />
				)}
			</EuiDescriptionList>
		</div>
	);
};

export default ArtistBasicInfo;
