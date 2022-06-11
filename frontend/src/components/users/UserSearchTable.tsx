import {
	EuiSpacer,
	EuiTable,
	EuiTableBody,
	EuiTableHeader,
	EuiTableHeaderCell,
	EuiTableRow,
	EuiTableRowCell,
} from '@elastic/eui';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { IUserObject } from '../../dto/IUserObject';
import { EntryUrlMapper } from '../../models/EntryUrlMapper';
import { UserSearchStore } from '../../stores/users/UserSearchStore';
import { Avatar } from '../Avatar';
import { Link } from '../Link';
import { Pagination } from '../Pagination';
import { TableEmptyBody } from '../TableEmptyBody';

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
						<Link to={EntryUrlMapper.details(user)}>
							{user.name}
						</Link>
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
		const { t } = useTranslation();

		return store.users.length === 0 ? (
			<TableEmptyBody
				noItemsMessage={
					store.loading
						? t('shared.loading')
						: t('shared.noItemsFound')
				}
			/>
		) : (
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

const UserSearchTable = observer(
	({ store }: UserSearchTableProps): React.ReactElement => {
		return (
			<>
				<EuiTable
					className={classNames({
						'euiBasicTable-loading': store.loading,
					})}
				>
					<UserSearchTableHeader />
					<UserSearchTableBody store={store} />
				</EuiTable>

				<EuiSpacer size="m" />

				<Pagination store={store.pagination} />
			</>
		);
	},
);

export default UserSearchTable;
