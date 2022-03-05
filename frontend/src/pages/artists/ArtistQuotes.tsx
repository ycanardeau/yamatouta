import {
	EuiBreadcrumb,
	EuiBreadcrumbs,
	EuiPageHeader,
	EuiSpacer,
} from '@elastic/eui';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import QuoteSearchList from '../../components/quotes/QuoteSearchList';
import { useStoreWithPagination } from '../../components/useStoreWithPagination';
import useYamatoutaTitle from '../../components/useYamatoutaTitle';
import { IArtistObject } from '../../dto/artists/IArtistObject';
import { ArtistDetailsStore } from '../../stores/artists/ArtistDetailsStore';

interface BreadcrumbsProps {
	artist: IArtistObject;
}

const Breadcrumbs = ({ artist }: BreadcrumbsProps): React.ReactElement => {
	const { t } = useTranslation();

	const navigate = useNavigate();

	const breadcrumbs: EuiBreadcrumb[] = [
		{
			text: t('shared.artists'),
			href: '/artists',
			onClick: (e): void => {
				e.preventDefault();
				navigate('/artists');
			},
		},
		{
			text: artist.name,
			href: `/artists/${artist.id}`,
			onClick: (e): void => {
				e.preventDefault();
				navigate(`/artists/${artist.id}`);
			},
		},
		{
			text: t('shared.quotes'),
			href: `/artists/${artist.id}/quotes`,
			onClick: (e): void => {
				e.preventDefault();
				navigate(`/artists/${artist.id}/quotes`);
			},
		},
	];

	return <EuiBreadcrumbs breadcrumbs={breadcrumbs} truncate={false} />;
};

interface ArtistQuotesProps {
	artist: IArtistObject;
	store: ArtistDetailsStore;
}

const ArtistQuotes = observer(
	({ artist, store }: ArtistQuotesProps): React.ReactElement => {
		const { t } = useTranslation();

		useYamatoutaTitle(artist.name, true);

		useStoreWithPagination(store.quoteSearchStore);

		return (
			<>
				<Breadcrumbs artist={artist} />
				<EuiSpacer size="xs" />
				<EuiPageHeader pageTitle={t('shared.quotes')} />

				<QuoteSearchList store={store.quoteSearchStore} />
			</>
		);
	},
);

export default ArtistQuotes;
