import {
	EuiPageContent,
	EuiPageContentBody,
	EuiPageHeader,
	EuiSpacer,
} from '@elastic/eui';
import { useStoreWithPagination } from '@vocadb/route-sphere';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { HashtagBreadcrumbs } from '../../components/hashtags/HashtagBreadcrumbs';
import { HashtagSearchTable } from '../../components/hashtags/HashtagSearchTable';
import { useYamatoutaTitle } from '../../components/useYamatoutaTitle';
import { HashtagSearchStore } from '../../stores/hashtags/HashtagSearchStore';

const HashtagIndex = (): React.ReactElement => {
	const { t, ready } = useTranslation();

	const [store] = React.useState(() => new HashtagSearchStore());

	useYamatoutaTitle(t('shared.hashtags'), ready);

	useStoreWithPagination(store);

	return (
		<>
			<HashtagBreadcrumbs />
			<EuiSpacer size="xs" />
			<EuiPageHeader pageTitle={t('shared.hashtags')} />

			<EuiPageContent
				hasBorder={false}
				hasShadow={false}
				paddingSize="none"
				color="transparent"
				borderRadius="none"
			>
				<EuiPageContentBody>
					<HashtagSearchTable store={store} />
				</EuiPageContentBody>
			</EuiPageContent>
		</>
	);
};

export default HashtagIndex;