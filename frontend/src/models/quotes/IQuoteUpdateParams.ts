import { IHashtagUpdateParams } from '../IHashtagUpdateParams';
import { IWebLinkUpdateParams } from '../IWebLinkUpdateParams';
import { IWorkLinkUpdateParams } from '../IWorkLinkUpdateParams';
import { QuoteType } from './QuoteType';

export interface IQuoteUpdateParams {
	id: number;
	text: string;
	quoteType: QuoteType;
	locale: string;
	artistId: number;
	hashtags: IHashtagUpdateParams[];
	webLinks: IWebLinkUpdateParams[];
	workLinks: IWorkLinkUpdateParams[];
}
