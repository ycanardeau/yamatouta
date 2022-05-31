import { EuiButton, EuiIcon } from '@elastic/eui';
import {
	EditRegular,
	HistoryRegular,
	InfoRegular,
} from '@fluentui/react-icons';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { QuotePage } from '../../components/quotes/QuotePage';
import { useQuoteDetails } from '../../components/quotes/useQuoteDetails';
import { useAuth } from '../../components/useAuth';
import { useYamatoutaTitle } from '../../components/useYamatoutaTitle';
import { IQuoteObject } from '../../dto/IQuoteObject';
import { QuoteDetailsObject } from '../../dto/QuoteDetailsObject';
import { Permission } from '../../models/Permission';
import { QuoteDetailsStore } from '../../stores/quotes/QuoteDetailsStore';
import QuoteBasicInfo from './QuoteBasicInfo';

interface LayoutProps {
	store: QuoteDetailsStore;
}

const Layout = observer(({ store }: LayoutProps): React.ReactElement => {
	const { t } = useTranslation();

	const quote = store.quote;

	const navigate = useNavigate();
	const { pathname } = useLocation();

	const tab = pathname.split('/')[3];

	const auth = useAuth();

	const title = quote.text.replaceAll('\n', '');

	useYamatoutaTitle(title, true);

	return (
		<QuotePage
			quote={quote}
			pageHeaderProps={{
				pageTitle: title,
				rightSideItems: [
					<EuiButton
						size="s"
						href={`/quotes/${quote.id}/edit`}
						onClick={(
							e: React.MouseEvent<HTMLAnchorElement>,
						): void => {
							e.preventDefault();
							navigate(`/quotes/${quote.id}/edit`);
						}}
						iconType={EditRegular}
						isDisabled={
							!auth.permissionContext.hasPermission(
								Permission.Quote_Update,
							)
						}
					>
						{t('shared.doEdit')}
					</EuiButton>,
					<EuiButton
						size="s"
						href={`/quotes/${quote.id}/revisions`}
						onClick={(
							e: React.MouseEvent<HTMLAnchorElement>,
						): void => {
							e.preventDefault();
							navigate(`/quotes/${quote.id}/revisions`);
						}}
						iconType={HistoryRegular}
						isDisabled={
							!auth.permissionContext.hasPermission(
								Permission.Revision_View,
							)
						}
					>
						{t('shared.viewHistory')}
					</EuiButton>,
				],
				tabs: [
					{
						href: `/quotes/${quote.id}`,
						onClick: (
							e: React.MouseEvent<HTMLAnchorElement>,
						): void => {
							e.preventDefault();
							navigate(`/quotes/${quote.id}`);
						},
						prepend: <EuiIcon type={InfoRegular} />,
						isSelected: tab === undefined,
						label: t('shared.basicInfo'),
					},
				],
			}}
		>
			<Routes>
				<Route path="" element={<QuoteBasicInfo quote={quote} />} />
			</Routes>
		</QuotePage>
	);
});

const QuoteDetails = (): React.ReactElement | null => {
	const [store] = useQuoteDetails(
		React.useCallback(
			(quote) =>
				new QuoteDetailsStore(
					QuoteDetailsObject.create(quote as Required<IQuoteObject>),
				),
			[],
		),
	);

	return store ? <Layout store={store} /> : null;
};

export default QuoteDetails;
