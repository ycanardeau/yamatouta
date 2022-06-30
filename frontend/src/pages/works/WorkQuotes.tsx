import { EuiSpacer } from '@elastic/eui';
import { useStoreWithPagination } from '@vocadb/route-sphere';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { QuoteSearchList } from '../../components/quotes/QuoteSearchList';
import { QuoteSearchOptions } from '../../components/quotes/QuoteSearchOptions';
import { useYamatoutaTitle } from '../../components/useYamatoutaTitle';
import { WorkDetailsStore } from '../../stores/works/WorkDetailsStore';

interface WorkQuotesProps {
	workDetailsStore: WorkDetailsStore;
}

const WorkQuotes = observer(
	({ workDetailsStore }: WorkQuotesProps): React.ReactElement => {
		const { t, ready } = useTranslation();

		const work = workDetailsStore.work;

		useYamatoutaTitle(
			`${t('shared.work')} "${work.name}" - ${t('shared.quotes')}`,
			ready,
		);

		useStoreWithPagination(workDetailsStore.quoteSearchStore);

		return (
			<>
				<QuoteSearchOptions store={workDetailsStore.quoteSearchStore} />

				<EuiSpacer size="m" />

				<QuoteSearchList store={workDetailsStore.quoteSearchStore} />
			</>
		);
	},
);

export default WorkQuotes;
