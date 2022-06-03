import { useStoreWithPagination } from '@vocadb/route-sphere';
import { observer } from 'mobx-react-lite';
import React from 'react';

import { QuoteSearchList } from '../../components/quotes/QuoteSearchList';
import { useYamatoutaTitle } from '../../components/useYamatoutaTitle';
import { ArtistDetailsStore } from '../../stores/artists/ArtistDetailsStore';

interface ArtistQuotesProps {
	artistDetailsStore: ArtistDetailsStore;
}

const ArtistQuotes = observer(
	({ artistDetailsStore }: ArtistQuotesProps): React.ReactElement => {
		const artist = artistDetailsStore.artist;

		useYamatoutaTitle(artist.name, true);

		useStoreWithPagination(artistDetailsStore.quoteSearchStore);

		return <QuoteSearchList store={artistDetailsStore.quoteSearchStore} />;
	},
);

export default ArtistQuotes;
