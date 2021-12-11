import {
	Avatar,
	List,
	ListItem,
	ListItemAvatar,
	ListItemButton,
	ListItemText,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

import Pagination from '../../components/Pagination';
import { useStoreWithPagination } from '../../components/useStoreWithPagination';
import useYamatoutaTitle from '../../components/useYamatoutaTitle';
import { IArtistObject } from '../../dto/artists/IArtistObject';
import { ArtistIndexStore } from '../../stores/artists/ArtistIndexStore';
import Layout from '../Layout';

const store = new ArtistIndexStore();

interface IArtistListItemProps {
	artist: IArtistObject;
}

const ArtistListItem = ({
	artist,
}: IArtistListItemProps): React.ReactElement => {
	return (
		<ListItem disablePadding>
			<ListItemButton
				component={RouterLink}
				to={`/artists/${artist.id}/quotes`}
			>
				<ListItemAvatar>
					<Avatar src={artist.avatarUrl} />
				</ListItemAvatar>
				<ListItemText primary={artist.name} />
			</ListItemButton>
		</ListItem>
	);
};

const ArtistList = observer((): React.ReactElement | null => {
	return store.artists.length > 0 ? (
		<List dense sx={{ width: '100%', bgcolor: 'background.paper' }}>
			{store.artists.map((artist) => (
				<ArtistListItem key={artist.id} artist={artist} />
			))}
		</List>
	) : null;
});

const ArtistIndex = observer((): React.ReactElement => {
	const { t, ready } = useTranslation();

	useYamatoutaTitle(t('shared.artists'), ready);

	useStoreWithPagination(store);

	return (
		<Layout
			breadcrumbItems={[
				{
					text: t('shared.artists'),
					to: '/artists',
					isCurrentItem: true,
				},
			]}
		>
			<Pagination store={store.paginationStore} />

			<ArtistList />

			<Pagination store={store.paginationStore} />
		</Layout>
	);
});

export default ArtistIndex;
