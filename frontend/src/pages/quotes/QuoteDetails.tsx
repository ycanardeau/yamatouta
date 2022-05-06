import {
	EuiBreadcrumb,
	EuiBreadcrumbs,
	EuiIcon,
	EuiPageContent,
	EuiPageContentBody,
	EuiPageHeader,
	EuiSpacer,
} from '@elastic/eui';
import {
	EditRegular,
	HistoryRegular,
	InfoRegular,
} from '@fluentui/react-icons';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
	Route,
	Routes,
	useLocation,
	useNavigate,
	useParams,
} from 'react-router-dom';

import { getQuote } from '../../api/QuoteApi';
import { useAuth } from '../../components/useAuth';
import useYamatoutaTitle from '../../components/useYamatoutaTitle';
import { IQuoteObject } from '../../dto/quotes/IQuoteObject';
import { Permission } from '../../models/Permission';
import { QuoteOptionalFields } from '../../models/QuoteOptionalFields';
import { QuoteDetailsStore } from '../../stores/quotes/QuoteDetailsStore';
import QuoteBasicInfo from './QuoteBasicInfo';
import QuoteEdit from './QuoteEdit';
import QuoteHistory from './QuoteHistory';

interface BreadcrumbsProps {
	quote: IQuoteObject;
}

const Breadcrumbs = ({ quote }: BreadcrumbsProps): React.ReactElement => {
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
		{
			text: quote.text.replaceAll('\n', ''),
			href: `/quotes/${quote.id}`,
			onClick: (e): void => {
				e.preventDefault();
				navigate(`/quotes/${quote.id}`);
			},
		},
	];

	return <EuiBreadcrumbs breadcrumbs={breadcrumbs} truncate={false} />;
};

interface LayoutProps {
	store: QuoteDetailsStore;
}

const Layout = observer(({ store }: LayoutProps): React.ReactElement => {
	const { t } = useTranslation();

	const quote = store.quote;

	useYamatoutaTitle(quote.text.replaceAll('\n', ''), true);

	const navigate = useNavigate();
	const { pathname } = useLocation();

	const tab = pathname.split('/')[3];

	const auth = useAuth();

	return (
		<>
			<Breadcrumbs quote={quote} />
			<EuiSpacer size="xs" />
			<EuiPageHeader
				pageTitle={quote.text.replaceAll('\n', '')}
				tabs={[
					{
						href: `/quotes/${quote.id}`,
						onClick: (
							e: React.MouseEvent<HTMLAnchorElement>,
						): void => {
							e.preventDefault();
							navigate(`/quotes/${quote.id}`);
						},
						prepend: <EuiIcon type={InfoRegular} />,
						isSelected: !tab,
						label: t('shared.basicInfo'),
					},
					{
						href: `/quotes/${quote.id}/edit`,
						onClick: (
							e: React.MouseEvent<HTMLAnchorElement>,
						): void => {
							e.preventDefault();
							navigate(`/quotes/${quote.id}/edit`);
						},
						prepend: <EuiIcon type={EditRegular} />,
						isSelected: tab === 'edit',
						disabled: !auth.permissionContext.hasPermission(
							Permission.EditQuotes,
						),
						label: t('shared.edit'),
					},
					{
						href: `/quotes/${quote.id}/revisions`,
						onClick: (
							e: React.MouseEvent<HTMLAnchorElement>,
						): void => {
							e.preventDefault();
							navigate(`/quotes/${quote.id}/revisions`);
						},
						prepend: <EuiIcon type={HistoryRegular} />,
						isSelected: tab === 'revisions',
						disabled: !auth.permissionContext.hasPermission(
							Permission.ViewEditHistory,
						),
						label: t('shared.revisions'),
					},
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
					<Routes>
						<Route
							path=""
							element={<QuoteBasicInfo quote={quote} />}
						/>
						<Route
							path="revisions"
							element={<QuoteHistory quote={quote} />}
						/>
						<Route
							path="edit"
							element={<QuoteEdit quoteDetailsStore={store} />}
						/>
					</Routes>
				</EuiPageContentBody>
			</EuiPageContent>
		</>
	);
});

const QuoteDetails = (): React.ReactElement | null => {
	const [store, setStore] = React.useState<QuoteDetailsStore>();

	const { quoteId } = useParams();

	React.useEffect(() => {
		getQuote({
			quoteId: Number(quoteId),
			fields: [QuoteOptionalFields.WebLinks],
		}).then((quote) => setStore(new QuoteDetailsStore(quote)));
	}, [quoteId]);

	return store ? <Layout store={store} /> : null;
};

export default QuoteDetails;
