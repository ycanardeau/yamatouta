import { EuiSpacer } from '@elastic/eui';
import { useStoreWithPagination } from '@vocadb/route-sphere';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { QuoteSearchList } from '../../components/quotes/QuoteSearchList';
import { QuoteSearchOptions } from '../../components/quotes/QuoteSearchOptions';
import { useYamatoutaTitle } from '../../components/useYamatoutaTitle';
import { HashtagDetailsStore } from '../../stores/hashtags/HashtagDetailsStore';

interface HashtagQuotesProps {
	hashtagDetailsStore: HashtagDetailsStore;
}

const HashtagQuotes = ({
	hashtagDetailsStore,
}: HashtagQuotesProps): React.ReactElement => {
	const { t, ready } = useTranslation();

	const hashtag = hashtagDetailsStore.hashtag;

	useYamatoutaTitle(
		`${t('shared.hashtag')} "#${hashtag.name}" - ${t('shared.quotes')}`,
		ready,
	);

	useStoreWithPagination(hashtagDetailsStore.quoteSearchStore);

	return (
		<>
			<QuoteSearchOptions store={hashtagDetailsStore.quoteSearchStore} />

			<EuiSpacer size="m" />

			<QuoteSearchList store={hashtagDetailsStore.quoteSearchStore} />
		</>
	);
};

export default HashtagQuotes;
