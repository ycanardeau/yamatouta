import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Pagination from '../../components/Pagination';
import QuoteList from '../../components/QuoteList';
import { useStoreWithPagination } from '../../components/useStoreWithPagination';
import useYamatoutaTitle from '../../components/useYamatoutaTitle';
import { IArtistDto } from '../../dto/artists/IArtistDto';
import { ArtistDetailsStore } from '../../stores/artists/ArtistDetailsStore';
import Layout from '../Layout';

interface IArtistQuotesProps {
	artist: IArtistDto;
	store: ArtistDetailsStore;
}

const ArtistQuotes = observer(
	({ artist, store }: IArtistQuotesProps): React.ReactElement | null => {
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
