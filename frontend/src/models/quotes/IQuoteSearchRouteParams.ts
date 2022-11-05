import { QuoteSortRule } from '@/models/quotes/QuoteSortRule';
import { QuoteType } from '@/models/quotes/QuoteType';

export interface IQuoteSearchRouteParams {
	page?: number;
	pageSize?: number;
	sort?: QuoteSortRule;
	query?: string;
	quoteType?: QuoteType;
}
