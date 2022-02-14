import { Link, Typography } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { getQuote } from '../../api/QuoteApi';
import Layout from '../../components/layout/Layout';
import QuoteListItem from '../../components/quotes/QuoteListItem';
import useYamatoutaTitle from '../../components/useYamatoutaTitle';
import { IQuoteObject } from '../../dto/quotes/IQuoteObject';

interface QuoteDetailsLayoutProps {
	quote: IQuoteObject;
}

const QuoteDetailsLayout = ({
	quote,
}: QuoteDetailsLayoutProps): React.ReactElement => {
	const { t } = useTranslation();

	const quoteText = quote.phrases.join('');

	useYamatoutaTitle(quoteText, true);

	return (
		<Layout
			breadcrumbItems={[
				{ text: t('shared.quotes'), to: '/quotes' },
				{
					text: quoteText,
					to: `/quotes/${quote.id}`,
					isCurrentItem: true,
				},
			]}
			meta={{ description: quoteText }}
		>
			<QuoteListItem quote={quote} showDetailsButton={false} />

			{quote.sourceUrl && (
				<>
					<Typography variant="h6">{t('shared.source')}</Typography>
					<Typography paragraph>
						<Link
							target="_blank"
							rel="noopener noreferrer"
							href={quote.sourceUrl}
							underline="hover"
						>
							{quote.sourceUrl}
						</Link>
					</Typography>
				</>
			)}
		</Layout>
	);
};

const QuoteDetails = (): React.ReactElement | null => {
	const [model, setModel] = React.useState<
		{ quote: IQuoteObject } | undefined
	>();

	const { quoteId } = useParams();

	React.useEffect(() => {
		getQuote(Number(quoteId)).then((quote) => setModel({ quote: quote }));
	}, [quoteId]);

	return model ? <QuoteDetailsLayout quote={model.quote} /> : null;
};

export default QuoteDetails;
