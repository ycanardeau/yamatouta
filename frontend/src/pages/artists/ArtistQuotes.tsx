import {
	EuiDescriptionList,
	EuiDescriptionListDescription,
	EuiDescriptionListTitle,
	EuiSpacer,
} from '@elastic/eui';
import { useStoreWithPagination } from '@vocadb/route-sphere';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { WebLinkList } from '../../components/WebLinkList';
import { QuoteSearchList } from '../../components/quotes/QuoteSearchList';
import { useYamatoutaTitle } from '../../components/useYamatoutaTitle';
import { ArtistDetailsStore } from '../../stores/artists/ArtistDetailsStore';

interface ArtistQuotesProps {
	artistDetailsStore: ArtistDetailsStore;
}

const ArtistQuotes = observer(
	({ artistDetailsStore }: ArtistQuotesProps): React.ReactElement => {
		const { t } = useTranslation();

		const artist = artistDetailsStore.artist;

		useYamatoutaTitle(artist.name, true);

		useStoreWithPagination(artistDetailsStore.quoteSearchStore);

		return (
			<>
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
							<>
								<EuiDescriptionListTitle>
									{t('shared.externalLinks')}
								</EuiDescriptionListTitle>
								<EuiDescriptionListDescription>
									<WebLinkList webLinks={artist.webLinks} />
								</EuiDescriptionListDescription>
							</>
						)}
					</EuiDescriptionList>
				</div>

				<EuiSpacer size="l" />

				<QuoteSearchList store={artistDetailsStore.quoteSearchStore} />
			</>
		);
	},
);

export default ArtistQuotes;
