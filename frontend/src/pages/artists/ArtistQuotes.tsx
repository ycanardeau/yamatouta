import { observer } from 'mobx-react-lite';
import React from 'react';

import QuoteSearchList from '../../components/quotes/QuoteSearchList';
import { useStoreWithPagination } from '../../components/useStoreWithPagination';
import useYamatoutaTitle from '../../components/useYamatoutaTitle';
import { IArtistObject } from '../../dto/artists/IArtistObject';
import { ArtistDetailsStore } from '../../stores/artists/ArtistDetailsStore';

interface ArtistQuotesProps {
	artist: IArtistObject;
	store: ArtistDetailsStore;
}

const ArtistQuotes = observer(
	({ artist, store }: ArtistQuotesProps): React.ReactElement => {
		useYamatoutaTitle(artist.name, true);

		useStoreWithPagination(store.quoteSearchStore);

		return <QuoteSearchList store={store.quoteSearchStore} />;
	},
);

export default ArtistQuotes;
