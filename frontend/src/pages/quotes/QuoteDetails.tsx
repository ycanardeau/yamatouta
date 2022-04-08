import {
	EuiBreadcrumb,
	EuiBreadcrumbs,
	EuiIcon,
	EuiPageHeader,
	EuiSpacer,
} from '@elastic/eui';
import { HistoryRegular, InfoRegular } from '@fluentui/react-icons';
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
import QuoteBasicInfo from './QuoteBasicInfo';
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
			text: quote.text,
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
	quote: IQuoteObject;
}

const Layout = ({ quote }: LayoutProps): React.ReactElement => {
	const { t } = useTranslation();

	useYamatoutaTitle(quote.text, true);

	const navigate = useNavigate();
	const { pathname } = useLocation();

	const tab = pathname.split('/')[3];

	const auth = useAuth();

	return (
		<>
			<Breadcrumbs quote={quote} />
			<EuiSpacer size="xs" />
			<EuiPageHeader
				pageTitle={quote.text}
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

			<Routes>
				<Route path="" element={<QuoteBasicInfo quote={quote} />} />
				<Route
					path="revisions"
					element={<QuoteHistory quote={quote} />}
				/>
			</Routes>
		</>
	);
};

const QuoteDetails = (): React.ReactElement | null => {
	const [model, setModel] = React.useState<
		{ quote: IQuoteObject } | undefined
	>();

	const { quoteId } = useParams();

	React.useEffect(() => {
		getQuote({ quoteId: Number(quoteId) }).then((quote) =>
			setModel({ quote: quote }),
		);
	}, [quoteId]);

	return model ? <Layout quote={model.quote} /> : null;
};

export default QuoteDetails;
