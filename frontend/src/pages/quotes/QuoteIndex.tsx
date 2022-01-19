import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Pagination from '../../components/Pagination';
import QuoteList from '../../components/QuoteList';
import { useStoreWithPagination } from '../../components/useStoreWithPagination';
import useYamatoutaTitle from '../../components/useYamatoutaTitle';
import { QuoteIndexStore } from '../../stores/quotes/QuoteIndexStore';
import Layout from '../Layout';

const QuoteIndex = observer((): React.ReactElement => {
	const { t } = useTranslation();

	const [store] = React.useState(() => new QuoteIndexStore());

	useYamatoutaTitle(t('shared.quotes'), true);

	useStoreWithPagination(store);

	return (
		<Layout
			breadcrumbItems={[
				{
					text: t('shared.quotes'),
					to: '/quotes',
					isCurrentItem: true,
				},
			]}
		>
			<Pagination store={store.paginationStore} />

			<QuoteList quotes={store.quotes} />

			<Pagination store={store.paginationStore} />
		</Layout>
	);
});

export default QuoteIndex;
