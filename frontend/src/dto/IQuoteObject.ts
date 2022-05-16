import { QuoteType } from '../models/QuoteType';
import { IArtistObject } from './IArtistObject';
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
}
