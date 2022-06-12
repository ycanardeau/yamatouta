import { IHashtagLinkUpdateParams } from '../IHashtagLinkUpdateParams';
import { IWebLinkUpdateParams } from '../IWebLinkUpdateParams';
import { IWorkLinkUpdateParams } from '../IWorkLinkUpdateParams';
import { QuoteType } from './QuoteType';

export interface IQuoteUpdateParams {
	id: number;
	text: string;
	quoteType: QuoteType;
	locale: string;
	artistId: number;
	hashtagLinks: IHashtagLinkUpdateParams[];
	webLinks: IWebLinkUpdateParams[];
	workLinks: IWorkLinkUpdateParams[];
}
