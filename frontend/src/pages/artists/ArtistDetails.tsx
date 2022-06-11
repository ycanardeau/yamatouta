import { EuiButton, EuiIcon } from '@elastic/eui';
import {
	EditRegular,
	HistoryRegular,
	InfoRegular,
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
import { EntryUrlMapper } from '../../models/EntryUrlMapper';
import { Permission } from '../../models/Permission';
import { ArtistDetailsStore } from '../../stores/artists/ArtistDetailsStore';
import ArtistBasicInfo from './ArtistBasicInfo';
import ArtistQuotes from './ArtistQuotes';

interface LayoutProps {
	store: ArtistDetailsStore;
}

const Layout = observer(({ store }: LayoutProps): React.ReactElement => {
	const { t, ready } = useTranslation();

	const artist = store.artist;

	const navigate = useNavigate();
	const { pathname } = useLocation();

	const tab = pathname.split('/')[3];

	const auth = useAuth();

	const artistName = artist.name;

	useYamatoutaTitle(`${t('shared.artist')} "${artistName}"`, ready);

	return (
		<ArtistPage
			artist={artist}
			pageHeaderProps={{
				pageTitle: artistName,
				rightSideItems: [
					<EuiButton
						size="s"
						href={EntryUrlMapper.edit(artist)}
						onClick={(
							e: React.MouseEvent<HTMLAnchorElement>,
						): void => {
							e.preventDefault();
							navigate(EntryUrlMapper.edit(artist));
						}}
						iconType={EditRegular}
						isDisabled={
							!auth.permissionContext.hasPermission(
								Permission.UpdateArtists,
							)
						}
					>
						{t('shared.doEdit')}
					</EuiButton>,
					<EuiButton
						size="s"
						href={EntryUrlMapper.revisions(artist)}
						onClick={(
							e: React.MouseEvent<HTMLAnchorElement>,
						): void => {
							e.preventDefault();
							navigate(EntryUrlMapper.revisions(artist));
						}}
						iconType={HistoryRegular}
						isDisabled={
							!auth.permissionContext.hasPermission(
								Permission.ViewRevisions,
							)
						}
					>
						{t('shared.viewHistory')}
					</EuiButton>,
				],
				tabs: [
					{
						href: EntryUrlMapper.details(artist),
						onClick: (
							e: React.MouseEvent<HTMLAnchorElement>,
						): void => {
							e.preventDefault();
							navigate(EntryUrlMapper.details(artist));
						},
						prepend: <EuiIcon type={InfoRegular} />,
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
