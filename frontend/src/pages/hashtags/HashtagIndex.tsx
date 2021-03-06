import { useStoreWithPagination } from '@vocadb/route-sphere';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { HashtagPage } from '../../components/hashtags/HashtagPage';
import { HashtagSearchTable } from '../../components/hashtags/HashtagSearchTable';
import { useYamatoutaTitle } from '../../components/useYamatoutaTitle';
import { HashtagSearchStore } from '../../stores/hashtags/HashtagSearchStore';

const HashtagIndex = (): React.ReactElement => {
	const { t, ready } = useTranslation();

	const [store] = React.useState(() => new HashtagSearchStore());

	useYamatoutaTitle(t('shared.hashtags'), ready);

	useStoreWithPagination(store);

	return (
		<HashtagPage pageHeaderProps={{ pageTitle: t('shared.hashtags') }}>
			<HashtagSearchTable store={store} />
		</HashtagPage>
	);
};

export default HashtagIndex;
