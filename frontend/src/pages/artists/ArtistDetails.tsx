import {
	EuiBreadcrumb,
	EuiBreadcrumbs,
	EuiIcon,
	EuiPageHeader,
	EuiSpacer,
} from '@elastic/eui';
import {
	HistoryRegular,
	InfoRegular,
	MusicNote2Regular,
} from '@fluentui/react-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
	Route,
	Routes,
	useLocation,
	useNavigate,
	useParams,
} from 'react-router-dom';

import { getArtist } from '../../api/ArtistApi';
import lazyWithRetry from '../../components/lazyWithRetry';
import { useAuth } from '../../components/useAuth';
import { IArtistObject } from '../../dto/artists/IArtistObject';
import { Permission } from '../../models/Permission';
import { ArtistDetailsStore } from '../../stores/artists/ArtistDetailsStore';

const ArtistQuotes = lazyWithRetry(() => import('./ArtistQuotes'));

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
	artist: IArtistObject;
	store: ArtistDetailsStore;
}

const Layout = ({ artist, store }: LayoutProps): React.ReactElement => {
	const { t } = useTranslation();

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
						prepend: <EuiIcon type={InfoRegular} />,
						isSelected: !tab,
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

			<Routes>
				<Route path="" element={<></>} />
				<Route
					path="quotes"
					element={<ArtistQuotes artist={artist} store={store} />}
				/>
			</Routes>
		</>
	);
};

const ArtistDetails = (): React.ReactElement | null => {
	const [model, setModel] = React.useState<
		{ artist: IArtistObject; store: ArtistDetailsStore } | undefined
	>();

	const { artistId } = useParams();

	React.useEffect(() => {
		getArtist({ artistId: Number(artistId) }).then((artist) =>
			setModel({
				artist: artist,
				store: new ArtistDetailsStore(artist.id),
			}),
		);
	}, [artistId]);

	return model ? <Layout artist={model.artist} store={model.store} /> : null;
};

export default ArtistDetails;
