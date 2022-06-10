import { QuoteSortRule } from './QuoteSortRule';
import { QuoteType } from './QuoteType';

export interface IQuoteSearchRouteParams {
	page?: number;
	pageSize?: number;
	sort?: QuoteSortRule;
	query?: string;
	quoteType?: QuoteType;
}
