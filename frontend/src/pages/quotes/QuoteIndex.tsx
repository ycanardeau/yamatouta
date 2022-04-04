import {
	EuiBreadcrumb,
	EuiBreadcrumbs,
	EuiButton,
	EuiPageHeader,
	EuiSpacer,
} from '@elastic/eui';
import { AddRegular } from '@fluentui/react-icons';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import QuoteSearchList from '../../components/quotes/QuoteSearchList';
import { useAuth } from '../../components/useAuth';
import { useDialog } from '../../components/useDialog';
import { useStoreWithPagination } from '../../components/useStoreWithPagination';
import useYamatoutaTitle from '../../components/useYamatoutaTitle';
import { Permission } from '../../models/Permission';
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

	const auth = useAuth();

	const createQuoteDialog = useDialog();

	return (
		<>
			<Breadcrumbs />
			<EuiSpacer size="xs" />
			<EuiPageHeader
				pageTitle={t('shared.quotes')}
				rightSideItems={[
					<EuiButton
						size="s"
						onClick={createQuoteDialog.show}
						disabled={
							!auth.permissionContext.hasPermission(
								Permission.CreateQuotes,
							)
						}
						iconType={AddRegular}
					>
						{t('quotes.addQuote')}
					</EuiButton>,
				]}
			/>

			<QuoteSearchList store={store} />
		</>
	);
});

export default QuoteIndex;
