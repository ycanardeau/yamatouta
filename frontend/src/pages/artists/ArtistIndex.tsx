import { ArtistPage } from '@/components/artists/ArtistPage';
import { ArtistSearchOptions } from '@/components/artists/ArtistSearchOptions';
import { ArtistSearchTable } from '@/components/artists/ArtistSearchTable';
import { useAuth } from '@/components/useAuth';
import { useYamatoutaTitle } from '@/components/useYamatoutaTitle';
import { Permission } from '@/models/Permission';
import { ArtistSearchStore } from '@/stores/artists/ArtistSearchStore';
import { useLocationStateStore } from '@aigamo/route-sphere';
import { EuiButton, EuiSpacer } from '@elastic/eui';
import { AddRegular } from '@fluentui/react-icons';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const ArtistIndex = observer((): React.ReactElement => {
	const { t, ready } = useTranslation();

	const [store] = React.useState(() => new ArtistSearchStore());

	useYamatoutaTitle(t('shared.artists'), ready);

	useLocationStateStore(store);

	const navigate = useNavigate();

	const auth = useAuth();

	return (
		<ArtistPage
			pageHeaderProps={{
				pageTitle: t('shared.artists'),
				rightSideItems: [
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
				],
			}}
		>
			<ArtistSearchOptions store={store} />

			<EuiSpacer size="m" />

			<ArtistSearchTable store={store} />
		</ArtistPage>
	);
});

export default ArtistIndex;
