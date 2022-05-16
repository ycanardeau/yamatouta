import { EuiCommentList } from '@elastic/eui';
import React from 'react';

import { listQuoteRevisions } from '../../api/RevisionApi';
import RevisionComment from '../../components/revisions/RevisionComment';
import { IQuoteObject } from '../../dto/IQuoteObject';
import { IRevisionObject } from '../../dto/IRevisionObject';

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
	const [revisions, setRevisions] = React.useState<IRevisionObject[]>();

	React.useEffect(() => {
		listQuoteRevisions({ quoteId: quote.id }).then((result) =>
			setRevisions(result.items),
		);
	}, [quote]);

	return revisions ? <Layout revisions={revisions} /> : null;
};

export default QuoteHistory;
