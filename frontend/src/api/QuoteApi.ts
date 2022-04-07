import axios from 'axios';

import { ISearchResultObject } from '../dto/ISearchResultObject';
import { IQuoteObject } from '../dto/quotes/IQuoteObject';
import { QuoteType } from '../models/QuoteType';
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

export const createQuote = async ({
	text,
	quoteType,
	locale,
	artistId,
}: {
	text: string;
	quoteType: QuoteType;
	locale: string;
	artistId: number;
}): Promise<IQuoteObject> => {
	const response = await axios.post<IQuoteObject>('/quotes', {
		text,
		quoteType,
		locale,
		artistId,
	});

	return response.data;
};

export const updateQuote = async ({
	quoteId,
	text,
	quoteType,
	locale,
	artistId,
}: {
	quoteId: number;
	text: string;
	quoteType: QuoteType;
	locale: string;
	artistId: number;
}): Promise<IQuoteObject> => {
	const response = await axios.patch<IQuoteObject>(`/quotes/${quoteId}`, {
		text,
		quoteType,
		locale,
		artistId,
	});

	return response.data;
};

export const deleteQuote = async ({
	quoteId,
}: {
	quoteId: number;
}): Promise<void> => {
	await axios.delete<void>(`/quotes/${quoteId}`);
};
