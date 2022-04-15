import {
	EuiBreadcrumb,
	EuiBreadcrumbs,
	EuiIcon,
	EuiPageContent,
	EuiPageContentBody,
	EuiPageHeader,
	EuiSpacer,
} from '@elastic/eui';
import {
	EditRegular,
	HistoryRegular,
	MusicNote2Regular,
} from '@fluentui/react-icons';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
	Navigate,
	Route,
	Routes,
	useLocation,
	useNavigate,
	useParams,
} from 'react-router-dom';

import { getArtist } from '../../api/ArtistApi';
import { useAuth } from '../../components/useAuth';
import { IArtistObject } from '../../dto/artists/IArtistObject';
import { Permission } from '../../models/Permission';
import { ArtistDetailsStore } from '../../stores/artists/ArtistDetailsStore';
import ArtistEdit from './ArtistEdit';
import ArtistHistory from './ArtistHistory';
import ArtistQuotes from './ArtistQuotes';

interface BreadcrumbsProps {
	artist: IArtistObject;
}

const Breadcrumbs = ({ artist }: BreadcrumbsProps): React.ReactElement => {
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
		{
			text: artist.name,
			href: `/artists/${artist.id}`,
			onClick: (e): void => {
				e.preventDefault();
				navigate(`/artists/${artist.id}`);
			},
		},
	];

	return <EuiBreadcrumbs breadcrumbs={breadcrumbs} truncate={false} />;
};

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

	return (
		<>
			<Breadcrumbs artist={artist} />
			<EuiSpacer size="xs" />
			<EuiPageHeader
				pageTitle={artist.name}
				tabs={[
					{
						href: `/artists/${artist.id}`,
						onClick: (
							e: React.MouseEvent<HTMLAnchorElement>,
						): void => {
							e.preventDefault();
							navigate(`/artists/${artist.id}`);
						},
						prepend: <EuiIcon type={MusicNote2Regular} />,
						isSelected: !tab,
						label: t('shared.quotes'),
					},
					{
						href: `/artists/${artist.id}/edit`,
						onClick: (
							e: React.MouseEvent<HTMLAnchorElement>,
						): void => {
							e.preventDefault();
							navigate(`/artists/${artist.id}/edit`);
						},
						prepend: <EuiIcon type={EditRegular} />,
						isSelected: tab === 'edit',
						disabled: !auth.permissionContext.hasPermission(
							Permission.EditArtists,
						),
						label: t('shared.edit'),
					},
					{
						href: `/artists/${artist.id}/revisions`,
						onClick: (
							e: React.MouseEvent<HTMLAnchorElement>,
						): void => {
							e.preventDefault();
							navigate(`/artists/${artist.id}/revisions`);
						},
						prepend: <EuiIcon type={HistoryRegular} />,
						isSelected: tab === 'revisions',
						disabled: !auth.permissionContext.hasPermission(
							Permission.ViewEditHistory,
						),
						label: t('shared.revisions'),
					},
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
					<Routes>
						<Route
							path=""
							element={
								<ArtistQuotes artistDetailsStore={store} />
							}
						/>
						<Route
							path="quotes"
							element={
								<Navigate
									to={`/artists/${artist.id}`}
									replace
								/>
							}
						/>
						<Route
							path="revisions"
							element={<ArtistHistory artist={artist} />}
						/>
						<Route
							path="edit"
							element={<ArtistEdit artistDetailsStore={store} />}
						/>
					</Routes>
				</EuiPageContentBody>
			</EuiPageContent>
		</>
	);
});

const ArtistDetails = (): React.ReactElement | null => {
	const [store, setStore] = React.useState<ArtistDetailsStore>();

	const { artistId } = useParams();

	React.useEffect(() => {
		getArtist({ artistId: Number(artistId) }).then((artist) =>
			setStore(new ArtistDetailsStore(artist)),
		);
	}, [artistId]);

	return store ? <Layout store={store} /> : null;
};

export default ArtistDetails;
