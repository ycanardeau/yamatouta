import {
	EuiBreadcrumb,
	EuiBreadcrumbs,
	EuiButton,
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
import { AddRegular } from '@fluentui/react-icons';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import Avatar from '../../components/Avatar';
import Pagination from '../../components/Pagination';
import { useAuth } from '../../components/useAuth';
import { useDialog } from '../../components/useDialog';
import { useStoreWithPagination } from '../../components/useStoreWithPagination';
import useYamatoutaTitle from '../../components/useYamatoutaTitle';
import { Permission } from '../../models/Permission';
import { ArtistSearchStore } from '../../stores/artists/ArtistSearchStore';

const Breadcrumbs = (): React.ReactElement => {
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
	];

	return <EuiBreadcrumbs breadcrumbs={breadcrumbs} truncate={false} />;
};

const ArtistIndex = observer((): React.ReactElement => {
	const { t, ready } = useTranslation();

	const [store] = React.useState(() => new ArtistSearchStore());

	useYamatoutaTitle(t('shared.artists'), ready);

	useStoreWithPagination(store);

	const navigate = useNavigate();

	const auth = useAuth();

	const createArtistDialog = useDialog();

	return (
		<>
			<Breadcrumbs />
			<EuiSpacer size="xs" />
			<EuiPageHeader
				pageTitle={t('shared.artists')}
				rightSideItems={[
					<EuiButton
						size="s"
						onClick={createArtistDialog.show}
						disabled={
							!auth.permissionContext.hasPermission(
								Permission.CreateArtists,
							)
						}
						iconType={AddRegular}
					>
						{t('artists.addArtist')}
					</EuiButton>,
				]}
			/>

			<EuiTable>
				<EuiTableHeader>
					<EuiTableHeaderCell width={40} />
					<EuiTableHeaderCell>{t('artists.name')}</EuiTableHeaderCell>
				</EuiTableHeader>

				<EuiTableBody>
					{store.artists.map((artist) => (
						<EuiTableRow key={artist.id}>
							<EuiTableRowCell>
								<Avatar
									size="m"
									name={artist.name}
									imageUrl={artist.avatarUrl ?? ''}
								/>
							</EuiTableRowCell>
							<EuiTableRowCell
								mobileOptions={{
									header: t('artists.name'),
								}}
							>
								<EuiLink
									href={`/artists/${artist.id}`}
									onClick={(e: any): void => {
										e.preventDefault();
										navigate(`/artists/${artist.id}`);
									}}
								>
									{artist.name}
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

export default ArtistIndex;
