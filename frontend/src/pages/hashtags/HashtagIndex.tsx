import { HashtagPage } from '@/components/hashtags/HashtagPage';
import { HashtagSearchTable } from '@/components/hashtags/HashtagSearchTable';
import { useYamatoutaTitle } from '@/components/useYamatoutaTitle';
import { HashtagSearchStore } from '@/stores/hashtags/HashtagSearchStore';
import { useLocationStateStore } from '@aigamo/route-sphere';
import React from 'react';
import { useTranslation } from 'react-i18next';

const HashtagIndex = (): React.ReactElement => {
	const { t, ready } = useTranslation();

	const [store] = React.useState(() => new HashtagSearchStore());

	useYamatoutaTitle(t('shared.hashtags'), ready);

	useLocationStateStore(store);

	return (
		<HashtagPage pageHeaderProps={{ pageTitle: t('shared.hashtags') }}>
			<HashtagSearchTable store={store} />
		</HashtagPage>
	);
};

export default HashtagIndex;
