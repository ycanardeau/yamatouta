import { QuoteSearchList } from '@/components/quotes/QuoteSearchList';
import { QuoteSearchOptions } from '@/components/quotes/QuoteSearchOptions';
import { useYamatoutaTitle } from '@/components/useYamatoutaTitle';
import { HashtagDetailsStore } from '@/stores/hashtags/HashtagDetailsStore';
import { EuiSpacer } from '@elastic/eui';
import { useLocationStateStore } from '@vocadb/route-sphere';
import React from 'react';
import { useTranslation } from 'react-i18next';

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

	useLocationStateStore(hashtagDetailsStore.quoteSearchStore);

	return (
		<>
			<QuoteSearchOptions store={hashtagDetailsStore.quoteSearchStore} />

			<EuiSpacer size="m" />

			<QuoteSearchList store={hashtagDetailsStore.quoteSearchStore} />
		</>
	);
};

export default HashtagQuotes;
