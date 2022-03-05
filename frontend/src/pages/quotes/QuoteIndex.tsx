import {
	EuiBreadcrumb,
	EuiBreadcrumbs,
	EuiPageHeader,
	EuiSpacer,
} from '@elastic/eui';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import QuoteSearchList from '../../components/quotes/QuoteSearchList';
import { useStoreWithPagination } from '../../components/useStoreWithPagination';
import useYamatoutaTitle from '../../components/useYamatoutaTitle';
import { QuoteSearchStore } from '../../stores/quotes/QuoteSearchStore';

const Breadcrumbs = (): React.ReactElement => {
	const { t } = useTranslation();

	const navigate = useNavigate();

	const breadcrumbs: EuiBreadcrumb[] = [
		{
			text: t('shared.quotes'),
			href: '/quotes',
			onClick: (e): void => {
				e.preventDefault();
				navigate('/quotes');
			},
		},
	];

	return <EuiBreadcrumbs breadcrumbs={breadcrumbs} truncate={false} />;
};

const QuoteIndex = observer((): React.ReactElement => {
	const { t } = useTranslation();

	const [store] = React.useState(() => new QuoteSearchStore());

	useYamatoutaTitle(t('shared.quotes'), true);

	useStoreWithPagination(store);

	return (
		<>
			<Breadcrumbs />
			<EuiSpacer size="xs" />
			<EuiPageHeader pageTitle={t('shared.quotes')} />

			<QuoteSearchList store={store} />
		</>
	);
});

export default QuoteIndex;
