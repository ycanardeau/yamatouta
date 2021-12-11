import { Link, Typography } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { getQuote } from '../../api/QuoteApi';
import QuoteListItem from '../../components/QuoteListItem';
import { IQuoteObject } from '../../dto/quotes/IQuoteObject';
import Layout from '../Layout';

interface IQuoteDetailsLayoutProps {
	quote: IQuoteObject;
}

const QuoteDetailsLayout = ({
	quote,
}: IQuoteDetailsLayoutProps): React.ReactElement => {
	const { t } = useTranslation();

	return (
		<Layout
			breadcrumbItems={[
				{ text: t('shared.quotes'), to: '/quotes' },
				{
					text: quote.phrases.join(''),
					to: `/quotes/${quote.id}`,
					isCurrentItem: true,
				},
			]}
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
