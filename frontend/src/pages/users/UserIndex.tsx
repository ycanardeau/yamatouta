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
import Layout from '../../components/layout/Layout';
import { useStoreWithPagination } from '../../components/useStoreWithPagination';
import useYamatoutaTitle from '../../components/useYamatoutaTitle';
import { IUserObject } from '../../dto/users/IUserObject';
import { UserSearchStore } from '../../stores/users/UserSearchStore';

interface UserListItemProps {
	user: IUserObject;
}

const UserListItem = React.memo(
	({ user }: UserListItemProps): React.ReactElement => {
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
	},
);

interface UserListProps {
	users: IUserObject[];
}

const UserList = React.memo(({ users }: UserListProps): React.ReactElement => {
	return (
		<List
			dense
			sx={{ width: '100%', bgcolor: 'background.paper' }}
			disablePadding
		>
			{users.map((user) => (
				<UserListItem key={user.id} user={user} />
			))}
		</List>
	);
});

const UserIndex = observer((): React.ReactElement => {
	const { t, ready } = useTranslation();

	const [store] = React.useState(() => new UserSearchStore());

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

			<UserList users={store.users} />

			<Pagination store={store.paginationStore} />
		</Layout>
	);
});

export default UserIndex;
