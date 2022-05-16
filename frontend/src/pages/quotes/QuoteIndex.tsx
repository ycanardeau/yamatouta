import {
	EuiBreadcrumb,
	EuiBreadcrumbs,
	EuiButton,
	EuiPageContent,
	EuiPageContentBody,
	EuiPageHeader,
	EuiSpacer,
} from '@elastic/eui';
import { AddRegular } from '@fluentui/react-icons';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import QuoteCreateDialog from '../../components/quotes/QuoteCreateDialog';
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

	const quoteCreateDialog = useDialog();

	const navigate = useNavigate();

	return (
		<>
			<Breadcrumbs />
			<EuiSpacer size="xs" />
			<EuiPageHeader
				pageTitle={t('shared.quotes')}
				rightSideItems={[
					<EuiButton
						size="s"
						onClick={quoteCreateDialog.show}
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

			<EuiPageContent
				hasBorder={false}
				hasShadow={false}
				paddingSize="none"
				color="transparent"
				borderRadius="none"
			>
				<EuiPageContentBody>
					<QuoteSearchList store={store} />

					{quoteCreateDialog.visible && (
						<QuoteCreateDialog
							onClose={quoteCreateDialog.close}
							onSuccess={(quote): void =>
								navigate(`/quotes/${quote.id}/edit`)
							}
						/>
					)}
				</EuiPageContentBody>
			</EuiPageContent>
		</>
	);
});

export default QuoteIndex;
