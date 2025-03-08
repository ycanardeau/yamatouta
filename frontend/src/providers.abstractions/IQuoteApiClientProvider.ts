import { IQuoteDto } from '@/dto/IQuoteDto';
import { IRevisionDto } from '@/dto/IRevisionDto';
import { ISearchResultDto } from '@/dto/ISearchResultDto';
import { IQuoteUpdateParams } from '@/models/quotes/IQuoteUpdateParams';
import { QuoteOptionalField } from '@/models/quotes/QuoteOptionalField';
import { QuoteSortRule } from '@/models/quotes/QuoteSortRule';
import { QuoteType } from '@/models/quotes/QuoteType';
import { IPaginationParams } from '@/stores/PaginationStore';

export interface IQuoteApiClientProvider {
	create(request: IQuoteUpdateParams): Promise<IQuoteDto>;
	delete(request: { id: number }): Promise<void>;
	get(request: {
		id: number;
		fields?: QuoteOptionalField[];
	}): Promise<IQuoteDto>;
	list(request: {
		pagination: IPaginationParams;
		sort?: QuoteSortRule;
		query?: string;
		quoteType?: QuoteType;
		artistId?: number;
		workId?: number;
		hashtags?: string[];
	}): Promise<ISearchResultDto<IQuoteDto>>;
	listRevisions(request: {
		id: number;
	}): Promise<ISearchResultDto<IRevisionDto>>;
	update(request: IQuoteUpdateParams): Promise<IQuoteDto>;
}
