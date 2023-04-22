import { QuoteSearchList } from '@/components/quotes/QuoteSearchList';
import { QuoteSearchOptions } from '@/components/quotes/QuoteSearchOptions';
import { useYamatoutaTitle } from '@/components/useYamatoutaTitle';
import { QuoteSortRule } from '@/models/quotes/QuoteSortRule';
import { ArtistDetailsStore } from '@/stores/artists/ArtistDetailsStore';
import { QuoteSearchStore } from '@/stores/quotes/QuoteSearchStore';
import { useLocationStateStore } from '@aigamo/route-sphere';
import { EuiSpacer } from '@elastic/eui';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface ArtistQuotesProps {
	artistDetailsStore: ArtistDetailsStore;
}

const ArtistQuotes = observer(
	({ artistDetailsStore }: ArtistQuotesProps): React.ReactElement => {
		const artist = artistDetailsStore.artist;

		const quoteSearchStore = React.useMemo(() => {
			const quoteSearchStore = new QuoteSearchStore(
				QuoteSortRule.UpdatedDesc,
			);
			quoteSearchStore.artistId = artist.id;
			return quoteSearchStore;
		}, [artist]);

		const { t, ready } = useTranslation();

		useYamatoutaTitle(
			`${t('shared.artist')} "${artist.name}" - ${t('shared.quotes')}`,
			ready,
		);

		useLocationStateStore(quoteSearchStore);

		return (
			<>
				<QuoteSearchOptions store={quoteSearchStore} />

				<EuiSpacer size="m" />

				<QuoteSearchList store={quoteSearchStore} />
			</>
		);
	},
);

export default ArtistQuotes;
