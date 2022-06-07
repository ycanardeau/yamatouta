import {
	EuiSpacer,
	EuiTable,
	EuiTableBody,
	EuiTableHeader,
	EuiTableHeaderCell,
	EuiTableRow,
	EuiTableRowCell,
} from '@elastic/eui';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { IUserObject } from '../../dto/IUserObject';
import { UserSearchStore } from '../../stores/users/UserSearchStore';
import { Avatar } from '../Avatar';
import { Link } from '../Link';
import { Pagination } from '../Pagination';

const UserSearchTableHeader = React.memo((): React.ReactElement => {
	const { t } = useTranslation();

	return (
		<EuiTableHeader>
			<EuiTableHeaderCell>{t('auth.username')}</EuiTableHeaderCell>
		</EuiTableHeader>
	);
});

interface UserSearchTableRowProps {
	user: IUserObject;
}

const UserSearchTableRow = React.memo(
	({ user }: UserSearchTableRowProps): React.ReactElement => {
		const { t } = useTranslation();

		return (
			<EuiTableRow>
				<EuiTableRowCell
					mobileOptions={{
						header: t('auth.username'),
					}}
				>
					<span>
						<Avatar
							size="m"
							name={user.name}
							imageUrl={user.avatarUrl}
						/>{' '}
						<Link to={`/users/${user.id}`}>{user.name}</Link>
					</span>
				</EuiTableRowCell>
			</EuiTableRow>
		);
	},
);

interface UserSearchTableBodyProps {
	store: UserSearchStore;
}

const UserSearchTableBody = observer(
	({ store }: UserSearchTableBodyProps): React.ReactElement => {
		return (
			<EuiTableBody>
				{store.users.map((user) => (
					<UserSearchTableRow user={user} key={user.id} />
				))}
			</EuiTableBody>
		);
	},
);

interface UserSearchTableProps {
	store: UserSearchStore;
}

const UserSearchTable = ({
	store,
}: UserSearchTableProps): React.ReactElement => {
	return (
		<>
			<EuiTable>
				<UserSearchTableHeader />
				<UserSearchTableBody store={store} />
			</EuiTable>

			<EuiSpacer size="m" />

			<Pagination store={store.pagination} />
		</>
	);
};

export default UserSearchTable;
