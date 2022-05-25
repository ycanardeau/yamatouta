import React from 'react';
import { useParams } from 'react-router-dom';

import { quoteApi } from '../../api/quoteApi';
import { IQuoteObject } from '../../dto/IQuoteObject';
import { QuoteOptionalField } from '../../models/quotes/QuoteOptionalField';

export const useQuoteDetails = <T,>(
	factory: (quote: IQuoteObject) => T,
): [T | undefined] => {
	const { id } = useParams();

	const [quote, setQuote] = React.useState<T>();

	React.useEffect(() => {
		quoteApi
			.get({
				id: Number(id),
				fields: [QuoteOptionalField.WebLinks],
			})
			.then((quote) => setQuote(factory(quote)));
	}, [id, factory]);

	return [quote];
};
