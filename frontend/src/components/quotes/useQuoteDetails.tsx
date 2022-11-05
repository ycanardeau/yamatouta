import { quoteApi } from '@/api/quoteApi';
import { IQuoteDto } from '@/dto/IQuoteDto';
import { QuoteOptionalField } from '@/models/quotes/QuoteOptionalField';
import React from 'react';
import { useParams } from 'react-router-dom';

export const useQuoteDetails = <T,>(
	factory: (quote: IQuoteDto) => T,
): [T | undefined] => {
	const { id } = useParams();

	const [quote, setQuote] = React.useState<T>();

	React.useEffect(() => {
		quoteApi
			.get({
				id: Number(id),
				fields: Object.values(QuoteOptionalField),
			})
			.then((quote) => setQuote(factory(quote)));
	}, [id, factory]);

	return [quote];
};
