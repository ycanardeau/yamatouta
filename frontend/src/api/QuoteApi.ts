import axios from 'axios';

import { ISearchResultObject } from '../dto/ISearchResultObject';
import { IQuoteObject } from '../dto/quotes/IQuoteObject';
import { IPaginationParams } from '../stores/PaginationStore';

export const listQuotes = async ({
	pagination,
	artistId,
}: {
	pagination: IPaginationParams;
	artistId?: number;
}): Promise<ISearchResultObject<IQuoteObject>> => {
	const response = await axios.get<ISearchResultObject<IQuoteObject>>(
		'/quotes',
		{ params: { ...pagination, artistId } },
	);

	return response.data;
};

export const getQuote = async ({
	quoteId,
}: {
	quoteId: number;
}): Promise<IQuoteObject> => {
	const response = await axios.get<IQuoteObject>(`/quotes/${quoteId}`);

	return response.data;
};
