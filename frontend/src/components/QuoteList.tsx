import { observer } from 'mobx-react-lite';
import React from 'react';

import { IQuoteObject } from '../dto/quotes/IQuoteObject';
import QuoteListItem from './QuoteListItem';

interface IQuoteListProps {
	quotes: IQuoteObject[];
}

const QuoteList = observer(
	({ quotes }: IQuoteListProps): React.ReactElement | null => {
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
