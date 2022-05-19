import { QuoteType } from '../models/quotes/QuoteType';
import { IArtistObject } from './IArtistObject';
import { IWorkLinkObject } from './ILinkObject';
import { IWebLinkObject } from './IWebLinkObject';

export interface IQuoteObject {
	id: number;
	createdAt: Date;
	text: string;
	quoteType: QuoteType;
	locale: string;
	artist: IArtistObject;
	sourceUrl: string;
	webLinks: IWebLinkObject[];
	workLinks: IWorkLinkObject[];
}
