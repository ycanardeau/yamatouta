import {
	EuiBreadcrumb,
	EuiBreadcrumbs,
	EuiButton,
	EuiPageContent,
	EuiPageContentBody,
	EuiPageHeader,
	EuiSpacer,
} from '@elastic/eui';
import { AddRegular } from '@fluentui/react-icons';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import ArtistCreateDialog from '../../components/artists/ArtistCreateDialog';
import ArtistSearchTable from '../../components/artists/ArtistSearchTable';
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

			<EuiPageContent
				hasBorder={false}
				hasShadow={false}
				paddingSize="none"
				color="transparent"
				borderRadius="none"
			>
				<EuiPageContentBody>
					<ArtistSearchTable store={store} />

					{createArtistDialog.visible && (
						<ArtistCreateDialog
							onClose={createArtistDialog.close}
							onSuccess={(artist): void =>
								navigate(`/artists/${artist.id}/edit`)
							}
						/>
					)}
				</EuiPageContentBody>
			</EuiPageContent>
		</>
	);
});

export default ArtistIndex;
