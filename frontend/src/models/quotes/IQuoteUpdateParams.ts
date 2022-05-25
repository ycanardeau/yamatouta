import { IWebLinkUpdateParams } from '../IWebLinkUpdateParams';
import { QuoteType } from './QuoteType';

export interface IQuoteUpdateParams {
	id: number;
	text: string;
	quoteType: QuoteType;
	locale: string;
	artistId: number;
	webLinks: IWebLinkUpdateParams[];
}
