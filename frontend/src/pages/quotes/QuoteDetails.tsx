import {
	EuiBreadcrumb,
	EuiBreadcrumbs,
	EuiCommentList,
	EuiPageHeader,
	EuiSpacer,
} from '@elastic/eui';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { getQuote } from '../../api/QuoteApi';
import QuoteComment from '../../components/quotes/QuoteComment';
import useYamatoutaTitle from '../../components/useYamatoutaTitle';
import { IQuoteObject } from '../../dto/quotes/IQuoteObject';

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
			text: quote.phrases.join(''),
			href: `/quotes/${quote.id}`,
			onClick: (e): void => {
				e.preventDefault();
				navigate(`/quotes/${quote.id}`);
			},
		},
	];

	return <EuiBreadcrumbs breadcrumbs={breadcrumbs} truncate={false} />;
};

interface QuoteDetailsLayoutProps {
	quote: IQuoteObject;
}

const QuoteDetailsLayout = ({
	quote,
}: QuoteDetailsLayoutProps): React.ReactElement => {
	const quoteText = quote.phrases.join('');

	useYamatoutaTitle(quoteText, true);

	return (
		<>
			<Breadcrumbs quote={quote} />
			<EuiSpacer size="xs" />
			<EuiPageHeader pageTitle={quoteText} />

			<EuiCommentList>
				<QuoteComment quote={quote} />
			</EuiCommentList>
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

	return model ? <QuoteDetailsLayout quote={model.quote} /> : null;
};

export default QuoteDetails;
