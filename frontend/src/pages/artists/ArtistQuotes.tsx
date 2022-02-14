import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Pagination from '../../components/Pagination';
import Layout from '../../components/layout/Layout';
import QuoteList from '../../components/quotes/QuoteList';
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
		const { t } = useTranslation();

		useYamatoutaTitle(artist.name, true);

		useStoreWithPagination(store.quoteIndexStore);

		return (
			<Layout
				breadcrumbItems={[
					{ text: t('shared.artists'), to: '/artists' },
					{
						text: artist.name,
						to: `/artists/${artist.id}`,
					},
					{
						text: t('shared.quotes'),
						to: `/artists/${artist.id}/quotes`,
						isCurrentItem: true,
					},
				]}
			>
				<Pagination store={store.quoteIndexStore.paginationStore} />

				<QuoteList quotes={store.quoteIndexStore.quotes} />

				<Pagination store={store.quoteIndexStore.paginationStore} />
			</Layout>
		);
	},
);

export default ArtistQuotes;
