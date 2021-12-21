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
import { IUserObject } from '../../dto/users/IUserObject';
import { UserIndexStore } from '../../stores/users/UserIndexStore';
import Layout from '../Layout';

const store = new UserIndexStore();

interface IUserListItemProps {
	user: IUserObject;
}

const UserListItem = ({ user }: IUserListItemProps): React.ReactElement => {
	return (
		<ListItem disablePadding>
			<ListItemButton component={RouterLink} to={`/users/${user.id}`}>
				<ListItemAvatar>
					<Avatar src={user.avatarUrl} />
				</ListItemAvatar>
				<ListItemText primary={user.name} />
			</ListItemButton>
		</ListItem>
	);
};

const UserList = observer((): React.ReactElement | null => {
	return store.users.length > 0 ? (
		<List dense sx={{ width: '100%', bgcolor: 'background.paper' }}>
			{store.users.map((user) => (
				<UserListItem key={user.id} user={user} />
			))}
		</List>
	) : null;
});

const UserIndex = (): React.ReactElement => {
	const { t, ready } = useTranslation();

	useYamatoutaTitle(t('shared.users'), ready);

	useStoreWithPagination(store);

	return (
		<Layout
			breadcrumbItems={[
				{
					text: t('shared.users'),
					to: '/users',
					isCurrentItem: true,
				},
			]}
		>
			<Pagination store={store.paginationStore} />

			<UserList />

			<Pagination store={store.paginationStore} />
		</Layout>
	);
};

export default UserIndex;
