import { QuoteType } from '../models/quotes/QuoteType';
import { IArtistObject } from './IArtistObject';
import { IWebLinkObject } from './IWebLinkObject';
import { IWorkLinkObject } from './IWorkLinkObject';

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
