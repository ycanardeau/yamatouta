import {
	EuiBreadcrumb,
	EuiBreadcrumbs,
	EuiLink,
	EuiPageContent,
	EuiPageContentBody,
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
import Link from '../../components/Link';
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

			<EuiPageContent
				hasBorder={false}
				hasShadow={false}
				paddingSize="none"
				color="transparent"
				borderRadius="none"
			>
				<EuiPageContentBody>
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
										<Link to={`/users/${user.id}`}>
											{user.name}
										</Link>
									</EuiTableRowCell>
								</EuiTableRow>
							))}
						</EuiTableBody>
					</EuiTable>

					<EuiSpacer size="m" />

					<Pagination store={store.pagination} />
				</EuiPageContentBody>
			</EuiPageContent>
		</>
	);
});

export default UserIndex;
