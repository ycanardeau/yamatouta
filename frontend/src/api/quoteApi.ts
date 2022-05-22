import axios from 'axios';

import { IQuoteObject } from '../dto/IQuoteObject';
import { IRevisionObject } from '../dto/IRevisionObject';
import { ISearchResultObject } from '../dto/ISearchResultObject';
import { IWebLinkObject } from '../dto/IWebLinkObject';
import { QuoteOptionalField } from '../models/QuoteOptionalField';
import { QuoteType } from '../models/QuoteType';
import { IPaginationParams } from '../stores/PaginationStore';

class QuoteApi {
	create = async ({
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
		const response = await axios.post<IQuoteObject>('/quotes/create', {
			id: 0,
			text,
			quoteType,
			locale,
			artistId,
			webLinks,
		});

		return response.data;
	};

	delete = async ({ id }: { id: number }): Promise<void> => {
		await axios.delete<void>(`/quotes/delete`, { data: { id: id } });
	};

	get = async ({
		id,
		fields,
	}: {
		id: number;
		fields?: QuoteOptionalField[];
	}): Promise<IQuoteObject> => {
		const response = await axios.get<IQuoteObject>(`/quotes/get`, {
			params: { id: id, fields: fields },
		});

		return response.data;
	};

	list = async ({
		pagination,
		artistId,
	}: {
		pagination: IPaginationParams;
		artistId?: number;
	}): Promise<ISearchResultObject<IQuoteObject>> => {
		const response = await axios.get<ISearchResultObject<IQuoteObject>>(
			'/quotes/list',
			{ params: { ...pagination, artistId } },
		);

		return response.data;
	};

	listRevisions = async ({
		id,
	}: {
		id: number;
	}): Promise<ISearchResultObject<IRevisionObject>> => {
		const response = await axios.get<ISearchResultObject<IRevisionObject>>(
			`/quotes/list-revisions`,
			{ params: { id: id } },
		);

		return response.data;
	};

	update = async ({
		id,
		text,
		quoteType,
		locale,
		artistId,
		webLinks,
	}: {
		id: number;
		text: string;
		quoteType: QuoteType;
		locale: string;
		artistId: number;
		webLinks: IWebLinkObject[];
	}): Promise<IQuoteObject> => {
		const response = await axios.post<IQuoteObject>(`/quotes/update`, {
			id: id,
			text,
			quoteType,
			locale,
			artistId,
			webLinks,
		});

		return response.data;
	};
}

export const quoteApi = new QuoteApi();
