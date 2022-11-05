import { QuotePage } from '@/components/quotes/QuotePage';
import { useQuoteDetails } from '@/components/quotes/useQuoteDetails';
import { useAuth } from '@/components/useAuth';
import { useYamatoutaTitle } from '@/components/useYamatoutaTitle';
import { IQuoteObject } from '@/dto/IQuoteObject';
import { QuoteDetailsObject } from '@/dto/QuoteDetailsObject';
import { EntryUrlMapper } from '@/models/EntryUrlMapper';
import { Permission } from '@/models/Permission';
import QuoteBasicInfo from '@/pages/quotes/QuoteBasicInfo';
import { QuoteDetailsStore } from '@/stores/quotes/QuoteDetailsStore';
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

interface LayoutProps {
	store: QuoteDetailsStore;
}

const Layout = observer(({ store }: LayoutProps): React.ReactElement => {
	const { t, ready } = useTranslation();

	const quote = store.quote;

	const navigate = useNavigate();
	const { pathname } = useLocation();

	const tab = pathname.split('/')[3];

	const auth = useAuth();

	const quotePlainText = quote.plainText.replaceAll('\n', '');

	useYamatoutaTitle(
		`${t('shared.quote')} "${quotePlainText}" by ${quote.artist.name}`,
		ready,
	);

	return (
		<QuotePage
			quote={quote}
			pageHeaderProps={{
				pageTitle: quotePlainText,
				rightSideItems: [
					<EuiButton
						size="s"
						href={EntryUrlMapper.edit(quote)}
						onClick={(
							e: React.MouseEvent<HTMLAnchorElement>,
						): void => {
							e.preventDefault();
							navigate(EntryUrlMapper.edit(quote));
						}}
						iconType={EditRegular}
						isDisabled={
							!auth.permissionContext.hasPermission(
								Permission.UpdateQuotes,
							)
						}
					>
						{t('shared.doEdit')}
					</EuiButton>,
					<EuiButton
						size="s"
						href={EntryUrlMapper.revisions(quote)}
						onClick={(
							e: React.MouseEvent<HTMLAnchorElement>,
						): void => {
							e.preventDefault();
							navigate(EntryUrlMapper.revisions(quote));
						}}
						iconType={HistoryRegular}
						isDisabled={
							!auth.permissionContext.hasPermission(
								Permission.ViewRevisions,
							)
						}
					>
						{t('shared.viewHistory')}
					</EuiButton>,
				],
				tabs: [
					{
						href: EntryUrlMapper.details(quote),
						onClick: (
							e: React.MouseEvent<HTMLAnchorElement>,
						): void => {
							e.preventDefault();
							navigate(EntryUrlMapper.details(quote));
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
