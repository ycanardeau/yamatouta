import { EntryType } from '../models/EntryType';
import { IEntryWithEntryType } from '../models/IEntryWithEntryType';
import { QuoteType } from '../models/quotes/QuoteType';
import { IArtistObject } from './IArtistObject';
import { IWorkLinkObject } from './ILinkObject';
import { IWebLinkObject } from './IWebLinkObject';

export interface IQuoteObject extends IEntryWithEntryType<EntryType.Quote> {
	id: number;
	createdAt: string;
	text: string;
	quoteType: QuoteType;
	locale: string;
	artist: IArtistObject;
	sourceUrl: string;
	webLinks?: IWebLinkObject[];
	workLinks?: IWorkLinkObject[];
}
