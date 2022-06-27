import React from 'react';
import { useTranslation } from 'react-i18next';

import { HashtagPage } from '../../components/hashtags/HashtagPage';
import { useHashtagDetails } from '../../components/hashtags/useHashtagDetails';
import { useYamatoutaTitle } from '../../components/useYamatoutaTitle';
import { HashtagDetailsObject } from '../../dto/HashtagDetailsObject';
import { IHashtagObject } from '../../dto/IHashtagObject';
import { HashtagDetailsStore } from '../../stores/hashtags/HashtagDetailsStore';

interface LayoutProps {
	store: HashtagDetailsStore;
}

const Layout = ({ store }: LayoutProps): React.ReactElement => {
	const { t, ready } = useTranslation();

	const hashtag = store.hashtag;

	const hashtagName = `${hashtag.name}`;

	useYamatoutaTitle(`${t('shared.hashtag')} "#${hashtagName}"`, ready);

	return (
		<HashtagPage
			hashtag={hashtag}
			pageHeaderProps={{
				pageTitle: `#${hashtagName}`,
			}}
		></HashtagPage>
	);
};

const HashtagDetails = (): React.ReactElement | null => {
	const [store] = useHashtagDetails(
		React.useCallback(
			(hashtag) =>
				new HashtagDetailsStore(
					HashtagDetailsObject.create(
						hashtag as Required<IHashtagObject>,
					),
				),
			[],
		),
	);

	return store ? <Layout store={store} /> : null;
};

export default HashtagDetails;
