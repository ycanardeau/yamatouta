import { Avatar } from '@/components/Avatar';
import { Link } from '@/components/Link';
import { Pagination } from '@/components/Pagination';
import { TableEmptyBody } from '@/components/TableEmptyBody';
import { IUserDto } from '@/dto/IUserDto';
import { EntryUrlMapper } from '@/models/EntryUrlMapper';
import { UserSearchStore } from '@/stores/users/UserSearchStore';
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

const UserSearchTableHeader = React.memo((): React.ReactElement => {
	const { t } = useTranslation();

	return (
		<EuiTableHeader>
			<EuiTableHeaderCell>{t('auth.username')}</EuiTableHeaderCell>
		</EuiTableHeader>
	);
});

interface UserSearchTableRowProps {
	user: IUserDto;
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
