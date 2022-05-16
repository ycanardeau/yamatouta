import axios from 'axios';

import { IQuoteObject } from '../dto/IQuoteObject';
import { ISearchResultObject } from '../dto/ISearchResultObject';
import { IWebLinkObject } from '../dto/IWebLinkObject';
import { QuoteOptionalField } from '../models/QuoteOptionalField';
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
	fields,
}: {
	quoteId: number;
	fields?: QuoteOptionalField[];
}): Promise<IQuoteObject> => {
	const response = await axios.get<IQuoteObject>(`/quotes/${quoteId}`, {
		params: { fields: fields },
	});

	return response.data;
};

export const createQuote = async ({
	text,
	quoteType,
	locale,
	artistId,
	webLinks,
}: {
	text: string;
	quoteType: QuoteType;
	locale: string;
	artistId: number;
	webLinks: IWebLinkObject[];
}): Promise<IQuoteObject> => {
	const response = await axios.post<IQuoteObject>('/quotes', {
		text,
		quoteType,
		locale,
		artistId,
		webLinks,
	});

	return response.data;
};

export const updateQuote = async ({
	quoteId,
	text,
	quoteType,
	locale,
	artistId,
	webLinks,
}: {
	quoteId: number;
	text: string;
	quoteType: QuoteType;
	locale: string;
	artistId: number;
	webLinks: IWebLinkObject[];
}): Promise<IQuoteObject> => {
	const response = await axios.patch<IQuoteObject>(`/quotes/${quoteId}`, {
		text,
		quoteType,
		locale,
		artistId,
		webLinks,
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
