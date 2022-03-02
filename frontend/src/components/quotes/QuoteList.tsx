import React from 'react';

import { IQuoteObject } from '../../dto/quotes/IQuoteObject';
import QuoteListItem from './QuoteListItem';

interface QuoteListProps {
	quotes: IQuoteObject[];
}

const QuoteList = React.memo(
	({ quotes }: QuoteListProps): React.ReactElement => {
		return (
			<>
				{quotes.map((quote) => (
					<QuoteListItem key={quote.id} quote={quote} />
				))}
			</>
		);
	},
);

export default QuoteList;
