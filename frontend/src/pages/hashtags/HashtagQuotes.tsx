import { QuoteSearchList } from '@/components/quotes/QuoteSearchList';
import { QuoteSearchOptions } from '@/components/quotes/QuoteSearchOptions';
import { useYamatoutaTitle } from '@/components/useYamatoutaTitle';
import { QuoteSortRule } from '@/models/quotes/QuoteSortRule';
import { HashtagDetailsStore } from '@/stores/hashtags/HashtagDetailsStore';
import { QuoteSearchStore } from '@/stores/quotes/QuoteSearchStore';
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
	const hashtag = hashtagDetailsStore.hashtag;

	const [quoteSearchStore] = React.useState(() => {
		const quoteSearchStore = new QuoteSearchStore(
			QuoteSortRule.UpdatedDesc,
		);
		quoteSearchStore.hashtags = [hashtag.name];
		return quoteSearchStore;
	});

	const { t, ready } = useTranslation();

	useYamatoutaTitle(
		`${t('shared.hashtag')} "#${hashtag.name}" - ${t('shared.quotes')}`,
		ready,
	);

	useLocationStateStore(quoteSearchStore);

	return (
		<>
			<QuoteSearchOptions store={quoteSearchStore} />

			<EuiSpacer size="m" />

			<QuoteSearchList store={quoteSearchStore} />
		</>
	);
};

export default HashtagQuotes;
