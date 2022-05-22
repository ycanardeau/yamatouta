import {
	EuiButton,
	EuiPageContent,
	EuiPageContentBody,
	EuiPageHeader,
	EuiSpacer,
} from '@elastic/eui';
import { AddRegular } from '@fluentui/react-icons';
import { useStoreWithPagination } from '@vocadb/route-sphere';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import QuoteBreadcrumbs from '../../components/quotes/QuoteBreadcrumbs';
import QuoteSearchList from '../../components/quotes/QuoteSearchList';
import { useAuth } from '../../components/useAuth';
import { useYamatoutaTitle } from '../../components/useYamatoutaTitle';
import { Permission } from '../../models/Permission';
import { QuoteSearchStore } from '../../stores/quotes/QuoteSearchStore';

const QuoteIndex = observer((): React.ReactElement => {
	const { t } = useTranslation();

	const [store] = React.useState(() => new QuoteSearchStore());

	useYamatoutaTitle(t('shared.quotes'), true);

	useStoreWithPagination(store);

	const auth = useAuth();

	const navigate = useNavigate();

	return (
		<>
			<QuoteBreadcrumbs />
			<EuiSpacer size="xs" />
			<EuiPageHeader
				pageTitle={t('shared.quotes')}
				rightSideItems={[
					<EuiButton
						size="s"
						href="/quotes/create"
						onClick={(e: any): void => {
							e.preventDefault();
							navigate('/quotes/create');
						}}
						isDisabled={
							!auth.permissionContext.hasPermission(
								Permission.Quote_Create,
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
				</EuiPageContentBody>
			</EuiPageContent>
		</>
	);
});

export default QuoteIndex;
