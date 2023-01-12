import { HashtagPage } from '@/components/hashtags/HashtagPage';
import { useHashtagDetails } from '@/components/hashtags/useHashtagDetails';
import { useYamatoutaTitle } from '@/components/useYamatoutaTitle';
import { HashtagDetailsDto } from '@/dto/HashtagDetailsDto';
import { IHashtagDto } from '@/dto/IHashtagDto';
import HashtagQuotes from '@/pages/hashtags/HashtagQuotes';
import { HashtagDetailsStore } from '@/stores/hashtags/HashtagDetailsStore';
import { EuiIcon } from '@elastic/eui';
import { InfoRegular, MusicNote2Regular } from '@fluentui/react-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

interface LayoutProps {
	store: HashtagDetailsStore;
}

const Layout = ({ store }: LayoutProps): React.ReactElement => {
	const { t, ready } = useTranslation();

	const hashtag = store.hashtag;

	const navigate = useNavigate();
	const { pathname } = useLocation();

	const tab = pathname.split('/')[3];

	const hashtagName = `${hashtag.name}`;

	useYamatoutaTitle(`${t('shared.hashtag')} "#${hashtagName}"`, ready);

	return (
		<HashtagPage
			hashtag={hashtag}
			pageHeaderProps={{
				pageTitle: `#${hashtagName}`,
				tabs: [
					{
						href: `/hashtags/${encodeURIComponent(hashtagName)}`,
						onClick: (
							e: React.MouseEvent<HTMLAnchorElement>,
						): void => {
							e.preventDefault();
							navigate(
								`/hashtags/${encodeURIComponent(hashtagName)}`,
							);
						},
						prepend: <EuiIcon type={InfoRegular} />,
						isSelected: tab === undefined,
						label: t('shared.basicInfo'),
					},
					{
						href: `/hashtags/${encodeURIComponent(
							hashtagName,
						)}/quotes`,
						onClick: (
							e: React.MouseEvent<HTMLAnchorElement>,
						): void => {
							e.preventDefault();
							navigate(
								`/hashtags/${encodeURIComponent(
									hashtagName,
								)}/quotes`,
							);
						},
						prepend: <EuiIcon type={MusicNote2Regular} />,
						isSelected: tab === 'quotes',
						label: t('shared.quotes'),
					},
				],
			}}
		>
			<Routes>
				<Route path="" element={<></>} />
				<Route
					path="quotes"
					element={<HashtagQuotes hashtagDetailsStore={store} />}
				/>
			</Routes>
		</HashtagPage>
	);
};

const HashtagDetails = (): React.ReactElement | null => {
	const [store] = useHashtagDetails(
		React.useCallback((hashtag) => {
			const hashtagDetailsStore = new HashtagDetailsStore(
				HashtagDetailsDto.create(hashtag as Required<IHashtagDto>),
			);

			return hashtagDetailsStore;
		}, []),
	);

	return store ? <Layout store={store} /> : null;
};

export default HashtagDetails;
