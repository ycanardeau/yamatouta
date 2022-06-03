import { EuiButton, EuiIcon } from '@elastic/eui';
import {
	EditRegular,
	HistoryRegular,
	MusicNote2Regular,
} from '@fluentui/react-icons';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { ArtistPage } from '../../components/artists/ArtistPage';
import { useArtistDetails } from '../../components/artists/useArtistDetails';
import { useAuth } from '../../components/useAuth';
import { useYamatoutaTitle } from '../../components/useYamatoutaTitle';
import { ArtistDetailsObject } from '../../dto/ArtistDetailsObject';
import { IArtistObject } from '../../dto/IArtistObject';
import { Permission } from '../../models/Permission';
import { ArtistDetailsStore } from '../../stores/artists/ArtistDetailsStore';
import ArtistBasicInfo from './ArtistBasicInfo';
import ArtistQuotes from './ArtistQuotes';

interface LayoutProps {
	store: ArtistDetailsStore;
}

const Layout = observer(({ store }: LayoutProps): React.ReactElement => {
	const { t } = useTranslation();

	const artist = store.artist;

	const navigate = useNavigate();
	const { pathname } = useLocation();

	const tab = pathname.split('/')[3];

	const auth = useAuth();

	const title = artist.name;

	useYamatoutaTitle(title, true);

	return (
		<ArtistPage
			artist={artist}
			pageHeaderProps={{
				pageTitle: title,
				rightSideItems: [
					<EuiButton
						size="s"
						href={`/artists/${artist.id}/edit`}
						onClick={(
							e: React.MouseEvent<HTMLAnchorElement>,
						): void => {
							e.preventDefault();
							navigate(`/artists/${artist.id}/edit`);
						}}
						iconType={EditRegular}
						isDisabled={
							!auth.permissionContext.hasPermission(
								Permission.Artist_Update,
							)
						}
					>
						{t('shared.doEdit')}
					</EuiButton>,
					<EuiButton
						size="s"
						href={`/artists/${artist.id}/revisions`}
						onClick={(
							e: React.MouseEvent<HTMLAnchorElement>,
						): void => {
							e.preventDefault();
							navigate(`/artists/${artist.id}/revisions`);
						}}
						iconType={HistoryRegular}
						isDisabled={
							!auth.permissionContext.hasPermission(
								Permission.Revision_View,
							)
						}
					>
						{t('shared.viewHistory')}
					</EuiButton>,
				],
				tabs: [
					{
						href: `/artists/${artist.id}`,
						onClick: (
							e: React.MouseEvent<HTMLAnchorElement>,
						): void => {
							e.preventDefault();
							navigate(`/artists/${artist.id}`);
						},
						prepend: <EuiIcon type={MusicNote2Regular} />,
						isSelected: tab === undefined,
						label: t('shared.basicInfo'),
					},
					{
						href: `/artists/${artist.id}/quotes`,
						onClick: (
							e: React.MouseEvent<HTMLAnchorElement>,
						): void => {
							e.preventDefault();
							navigate(`/artists/${artist.id}/quotes`);
						},
						prepend: <EuiIcon type={MusicNote2Regular} />,
						isSelected: tab === 'quotes',
						label: t('shared.quotes'),
					},
				],
			}}
		>
			<Routes>
				<Route
					path=""
					element={<ArtistBasicInfo artistDetailsStore={store} />}
				/>
				<Route
					path="quotes"
					element={<ArtistQuotes artistDetailsStore={store} />}
				/>
			</Routes>
		</ArtistPage>
	);
});

const ArtistDetails = (): React.ReactElement | null => {
	const [store] = useArtistDetails(
		React.useCallback(
			(artist) =>
				new ArtistDetailsStore(
					ArtistDetailsObject.create(
						artist as Required<IArtistObject>,
					),
				),
			[],
		),
	);

	return store ? <Layout store={store} /> : null;
};

export default ArtistDetails;
