import { quoteApi } from '@/api/quoteApi';
import { QuotePage } from '@/components/quotes/QuotePage';
import { useQuoteDetails } from '@/components/quotes/useQuoteDetails';
import { RevisionComment } from '@/components/revisions/RevisionComment';
import { useYamatoutaTitle } from '@/components/useYamatoutaTitle';
import { IQuoteDto } from '@/dto/IQuoteDto';
import { IRevisionDto } from '@/dto/IRevisionDto';
import { EuiCommentList } from '@elastic/eui';
import React from 'react';

interface LayoutProps {
	quote: IQuoteDto;
	revisions: IRevisionDto[];
}

const Layout = ({ quote, revisions }: LayoutProps): React.ReactElement => {
	const title = quote.plainText.replaceAll('\n', '');

	useYamatoutaTitle(title, true);

	return (
		<QuotePage quote={quote} pageHeaderProps={{ pageTitle: title }}>
			<EuiCommentList>
				{revisions.map((revision, index) => (
					<RevisionComment key={index} revision={revision} />
				))}
			</EuiCommentList>
		</QuotePage>
	);
};

const QuoteHistory = (): React.ReactElement | null => {
	const [quote] = useQuoteDetails(React.useCallback((quote) => quote, []));

	const [revisions, setRevisions] = React.useState<IRevisionDto[]>();

	React.useEffect(() => {
		if (!quote) return;

		quoteApi
			.listRevisions({ id: quote.id })
			.then((result) => setRevisions(result.items));
	}, [quote]);

	return quote && revisions ? (
		<Layout quote={quote} revisions={revisions} />
	) : null;
};

export default QuoteHistory;
