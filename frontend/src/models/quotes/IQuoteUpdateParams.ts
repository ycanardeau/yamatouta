import { IWebLinkUpdateParams } from '../IWebLinkUpdateParams';
import { IWorkLinkUpdateParams } from '../IWorkLinkUpdateParams';
import { QuoteType } from './QuoteType';

export interface IQuoteUpdateParams {
	id: number;
	text: string;
	quoteType: QuoteType;
	locale: string;
	artistId: number;
	webLinks: IWebLinkUpdateParams[];
	workLinks: IWorkLinkUpdateParams[];
}
