import {
	EuiBreadcrumb,
	EuiBreadcrumbs,
	EuiLink,
	EuiPageHeader,
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
import { useNavigate } from 'react-router-dom';

import Avatar from '../../components/Avatar';
import Pagination from '../../components/Pagination';
import { useStoreWithPagination } from '../../components/useStoreWithPagination';
import useYamatoutaTitle from '../../components/useYamatoutaTitle';
import { UserSearchStore } from '../../stores/users/UserSearchStore';

const Breadcrumbs = (): React.ReactElement => {
	const { t } = useTranslation();

	const navigate = useNavigate();

	const breadcrumbs: EuiBreadcrumb[] = [
		{
			text: t('shared.users'),
			href: '/users',
			onClick: (e): void => {
				e.preventDefault();
				navigate('/users');
			},
		},
	];

	return <EuiBreadcrumbs breadcrumbs={breadcrumbs} truncate={false} />;
};

const UserIndex = observer((): React.ReactElement => {
	const { t, ready } = useTranslation();

	const [store] = React.useState(() => new UserSearchStore());

	useYamatoutaTitle(t('shared.users'), ready);

	useStoreWithPagination(store);

	const navigate = useNavigate();

	return (
		<>
			<Breadcrumbs />
			<EuiSpacer size="xs" />
			<EuiPageHeader pageTitle={t('shared.users')} />

			<EuiTable>
				<EuiTableHeader>
					<EuiTableHeaderCell width={40} />
					<EuiTableHeaderCell>
						{t('auth.username')}
					</EuiTableHeaderCell>
				</EuiTableHeader>

				<EuiTableBody>
					{store.users.map((user) => (
						<EuiTableRow key={user.id}>
							<EuiTableRowCell>
								<Avatar
									size="m"
									name={user.name}
									imageUrl={user.avatarUrl}
								/>
							</EuiTableRowCell>
							<EuiTableRowCell
								mobileOptions={{
									header: t('auth.username'),
								}}
							>
								<EuiLink
									href={`/users/${user.id}`}
									onClick={(e: any): void => {
										e.preventDefault();
										navigate(`/users/${user.id}`);
									}}
								>
									{user.name}
								</EuiLink>
							</EuiTableRowCell>
						</EuiTableRow>
					))}
				</EuiTableBody>
			</EuiTable>

			<EuiSpacer size="m" />

			<Pagination store={store.paginationStore} />
		</>
	);
});

export default UserIndex;
