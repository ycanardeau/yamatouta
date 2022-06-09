import {
	EuiButton,
	EuiPageContent,
	EuiPageContentBody,
	EuiPageHeader,
	EuiSpacer,
} from '@elastic/eui';
import { AddRegular } from '@fluentui/react-icons';
import { useStoreWithPagination } from '@vocadb/route-sphere';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { ArtistBreadcrumbs } from '../../components/artists/ArtistBreadcrumbs';
import { ArtistSearchOptions } from '../../components/artists/ArtistSearchOptions';
import { ArtistSearchTable } from '../../components/artists/ArtistSearchTable';
import { useAuth } from '../../components/useAuth';
import { useYamatoutaTitle } from '../../components/useYamatoutaTitle';
import { Permission } from '../../models/Permission';
import { ArtistSearchStore } from '../../stores/artists/ArtistSearchStore';

const ArtistIndex = observer((): React.ReactElement => {
	const { t, ready } = useTranslation();

	const [store] = React.useState(() => new ArtistSearchStore());

	useYamatoutaTitle(t('shared.artists'), ready);

	useStoreWithPagination(store);

	const navigate = useNavigate();

	const auth = useAuth();

	return (
		<>
			<ArtistBreadcrumbs />
			<EuiSpacer size="xs" />
			<EuiPageHeader
				pageTitle={t('shared.artists')}
				rightSideItems={[
					<EuiButton
						size="s"
						href="/artists/create"
						onClick={(e: any): void => {
							e.preventDefault();
							navigate('/artists/create');
						}}
						isDisabled={
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
					<ArtistSearchOptions store={store} />

					<EuiSpacer size="m" />

					<ArtistSearchTable store={store} />
				</EuiPageContentBody>
			</EuiPageContent>
		</>
	);
});

export default ArtistIndex;
