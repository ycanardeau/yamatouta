import { EuiCommentList } from '@elastic/eui';
import React from 'react';

import { listQuoteRevisions } from '../../api/RevisionApi';
import RevisionComment from '../../components/revisions/RevisionComment';
import { IQuoteObject } from '../../dto/quotes/IQuoteObject';
import { IRevisionObject } from '../../dto/revisions/IRevisionObject';

interface LayoutProps {
	revisions: IRevisionObject[];
}

const Layout = ({ revisions }: LayoutProps): React.ReactElement => {
	return (
		<EuiCommentList>
			{revisions.map((revision, index) => (
				<RevisionComment key={index} revision={revision} />
			))}
		</EuiCommentList>
	);
};

interface QuoteHistoryProps {
	quote: IQuoteObject;
}

const QuoteHistory = ({
	quote,
}: QuoteHistoryProps): React.ReactElement | null => {
	const [model, setModel] =
		React.useState<{ revisions: IRevisionObject[] }>();

	React.useEffect(() => {
		listQuoteRevisions({ quoteId: quote.id }).then((result) =>
			setModel({ revisions: result.items }),
		);
	}, [quote]);

	return model ? <Layout revisions={model.revisions} /> : null;
};

export default QuoteHistory;
