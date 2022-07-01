import { EuiButton, EuiSpacer } from '@elastic/eui';
import { AddRegular } from '@fluentui/react-icons';
import { useStoreWithPagination } from '@vocadb/route-sphere';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { QuotePage } from '../../components/quotes/QuotePage';
import { QuoteSearchList } from '../../components/quotes/QuoteSearchList';
import { QuoteSearchOptions } from '../../components/quotes/QuoteSearchOptions';
import { useAuth } from '../../components/useAuth';
import { useYamatoutaTitle } from '../../components/useYamatoutaTitle';
import { Permission } from '../../models/Permission';
import { QuoteSearchStore } from '../../stores/quotes/QuoteSearchStore';

const QuoteIndex = observer((): React.ReactElement => {
	const { t, ready } = useTranslation();

	const [store] = React.useState(() => new QuoteSearchStore());

	useYamatoutaTitle(t('shared.quotes'), ready);

	useStoreWithPagination(store);

	const auth = useAuth();

	const navigate = useNavigate();

	return (
		<QuotePage
			pageHeaderProps={{
				pageTitle: t('shared.quotes'),
				rightSideItems: [
					<EuiButton
						size="s"
						href="/quotes/create"
						onClick={(e: any): void => {
							e.preventDefault();
							navigate('/quotes/create');
						}}
						isDisabled={
							!auth.permissionContext.hasPermission(
								Permission.CreateQuotes,
							)
						}
						iconType={AddRegular}
					>
						{t('quotes.addQuote')}
					</EuiButton>,
				],
			}}
		>
			<QuoteSearchOptions store={store} />

			<EuiSpacer size="m" />

			<QuoteSearchList store={store} />
		</QuotePage>
	);
});

export default QuoteIndex;
