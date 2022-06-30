import { EuiSpacer } from '@elastic/eui';
import { useStoreWithPagination } from '@vocadb/route-sphere';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { QuoteSearchList } from '../../components/quotes/QuoteSearchList';
import { QuoteSearchOptions } from '../../components/quotes/QuoteSearchOptions';
import { useYamatoutaTitle } from '../../components/useYamatoutaTitle';
import { ArtistDetailsStore } from '../../stores/artists/ArtistDetailsStore';

interface ArtistQuotesProps {
	artistDetailsStore: ArtistDetailsStore;
}

const ArtistQuotes = observer(
	({ artistDetailsStore }: ArtistQuotesProps): React.ReactElement => {
		const { t, ready } = useTranslation();

		const artist = artistDetailsStore.artist;

		useYamatoutaTitle(
			`${t('shared.artist')} "${artist.name}" - ${t('shared.quotes')}`,
			ready,
		);

		useStoreWithPagination(artistDetailsStore.quoteSearchStore);

		return (
			<>
				<QuoteSearchOptions
					store={artistDetailsStore.quoteSearchStore}
				/>

				<EuiSpacer size="m" />

				<QuoteSearchList store={artistDetailsStore.quoteSearchStore} />
			</>
		);
	},
);

export default ArtistQuotes;
