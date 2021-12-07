import axios from 'axios';

import { config } from '../config';
import { ISearchResultDto } from '../dto/ISearchResultDto';
import { IQuoteDto } from '../dto/quotes/IQuoteDto';
import { IPaginationParams } from '../stores/PaginationStore';

export const listQuotes = async ({
	pagination,
	artistId,
}: {
	pagination: IPaginationParams;
	artistId?: number;
}): Promise<ISearchResultDto<IQuoteDto>> => {
	const response = await axios.get<ISearchResultDto<IQuoteDto>>(
		`${config.apiEndpoint}/quotes`,
		{ params: { ...pagination, artistId } },
	);

	return response.data;
};

export const getQuote = async (quoteId: number): Promise<IQuoteDto> => {
	const response = await axios.get<IQuoteDto>(
		`${config.apiEndpoint}/quotes/${quoteId}`,
	);

	return response.data;
};
