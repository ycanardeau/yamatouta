import axios from 'axios';

import { IQuoteObject } from '../dto/IQuoteObject';
import { IRevisionObject } from '../dto/IRevisionObject';
import { ISearchResultObject } from '../dto/ISearchResultObject';
import { IQuoteUpdateParams } from '../models/quotes/IQuoteUpdateParams';
import { QuoteOptionalField } from '../models/quotes/QuoteOptionalField';
import { QuoteSortRule } from '../models/quotes/QuoteSortRule';
import { QuoteType } from '../models/quotes/QuoteType';
import { IPaginationParams } from '../stores/PaginationStore';

class QuoteApi {
	create = async ({
		text,
		quoteType,
		locale,
		artistId,
		webLinks,
		workLinks,
	}: IQuoteUpdateParams): Promise<IQuoteObject> => {
		const response = await axios.post<IQuoteObject>('/quotes/create', {
			id: 0,
			text,
			quoteType,
			locale,
			artistId,
			webLinks,
			workLinks,
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
		sort,
		query,
		quoteType,
		artistId,
		workId,
		hashtags,
	}: {
		pagination: IPaginationParams;
		sort?: QuoteSortRule;
		query?: string;
		quoteType?: QuoteType;
		artistId?: number;
		workId?: number;
		hashtags?: string[];
	}): Promise<ISearchResultObject<IQuoteObject>> => {
		const response = await axios.get<ISearchResultObject<IQuoteObject>>(
			'/quotes/list',
			{
				params: {
					...pagination,
					sort,
					query,
					quoteType,
					artistId,
					workId,
					hashtags,
				},
			},
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
		workLinks,
	}: IQuoteUpdateParams): Promise<IQuoteObject> => {
		const response = await axios.post<IQuoteObject>(`/quotes/update`, {
			id: id,
			text,
			quoteType,
			locale,
			artistId,
			webLinks,
			workLinks,
		});

		return response.data;
	};
}

export const quoteApi = new QuoteApi();
