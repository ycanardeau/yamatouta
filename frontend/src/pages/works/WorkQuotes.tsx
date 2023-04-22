import { QuoteSearchList } from '@/components/quotes/QuoteSearchList';
import { QuoteSearchOptions } from '@/components/quotes/QuoteSearchOptions';
import { useYamatoutaTitle } from '@/components/useYamatoutaTitle';
import { QuoteSortRule } from '@/models/quotes/QuoteSortRule';
import { QuoteSearchStore } from '@/stores/quotes/QuoteSearchStore';
import { WorkDetailsStore } from '@/stores/works/WorkDetailsStore';
import { useLocationStateStore } from '@aigamo/route-sphere';
import { EuiSpacer } from '@elastic/eui';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface WorkQuotesProps {
	workDetailsStore: WorkDetailsStore;
}

const WorkQuotes = observer(
	({ workDetailsStore }: WorkQuotesProps): React.ReactElement => {
		const work = workDetailsStore.work;

		const quoteSearchStore = React.useMemo(() => {
			const quoteSearchStore = new QuoteSearchStore(
				QuoteSortRule.UpdatedDesc,
			);
			quoteSearchStore.workId = work.id;
			return quoteSearchStore;
		}, [work]);

		const { t, ready } = useTranslation();

		useYamatoutaTitle(
			`${t('shared.work')} "${work.name}" - ${t('shared.quotes')}`,
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
	},
);

export default WorkQuotes;
