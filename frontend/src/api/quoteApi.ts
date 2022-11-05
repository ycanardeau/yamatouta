import { IQuoteDto } from '@/dto/IQuoteDto';
import { IRevisionDto } from '@/dto/IRevisionDto';
import { ISearchResultDto } from '@/dto/ISearchResultDto';
import { IQuoteUpdateParams } from '@/models/quotes/IQuoteUpdateParams';
import { QuoteOptionalField } from '@/models/quotes/QuoteOptionalField';
import { QuoteSortRule } from '@/models/quotes/QuoteSortRule';
import { QuoteType } from '@/models/quotes/QuoteType';
import { IPaginationParams } from '@/stores/PaginationStore';
import axios from 'axios';

class QuoteApi {
	create = async ({
		text,
		quoteType,
		locale,
		artistId,
		webLinks,
		workLinks,
	}: IQuoteUpdateParams): Promise<IQuoteDto> => {
		const response = await axios.post<IQuoteDto>('/quotes/create', {
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
	}): Promise<IQuoteDto> => {
		const response = await axios.get<IQuoteDto>(`/quotes/get`, {
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
	}): Promise<ISearchResultDto<IQuoteDto>> => {
		const response = await axios.get<ISearchResultDto<IQuoteDto>>(
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
	}): Promise<ISearchResultDto<IRevisionDto>> => {
		const response = await axios.get<ISearchResultDto<IRevisionDto>>(
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
	}: IQuoteUpdateParams): Promise<IQuoteDto> => {
		const response = await axios.post<IQuoteDto>(`/quotes/update`, {
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
