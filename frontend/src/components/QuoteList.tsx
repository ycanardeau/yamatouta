import { observer } from 'mobx-react-lite';
import React from 'react';

import { IQuoteDto } from '../dto/quotes/IQuoteDto';
import QuoteListItem from './QuoteListItem';

interface IQuoteListProps {
	quotes: IQuoteDto[];
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
