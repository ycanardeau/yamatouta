import { IWebLinkUpdateParams } from '@/models/IWebLinkUpdateParams';
import { IWorkLinkUpdateParams } from '@/models/IWorkLinkUpdateParams';
import { QuoteType } from '@/models/quotes/QuoteType';

export interface IQuoteUpdateParams {
	id: number;
	text: string;
	quoteType: QuoteType;
	locale: string;
	artistId: number;
	webLinks: IWebLinkUpdateParams[];
	workLinks: IWorkLinkUpdateParams[];
}
