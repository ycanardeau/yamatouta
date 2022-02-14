import React from 'react';

import { IQuoteObject } from '../../dto/quotes/IQuoteObject';
import QuoteListItem from './QuoteListItem';

interface QuoteListProps {
	quotes: IQuoteObject[];
}

const QuoteList = React.memo(
	({ quotes }: QuoteListProps): React.ReactElement | null => {
		return quotes.length > 0 ? (
			<>
				{quotes.map((quote) => (
					<QuoteListItem
						key={quote.id}
						quote={quote}
						showDetailsButton={true}
					/>
				))}
			</>
		) : null;
	},
);

export default QuoteList;
