import { EntryType } from '../models/EntryType';
import { IEntryWithEntryType } from '../models/IEntryWithEntryType';
import { QuoteType } from '../models/quotes/QuoteType';
import { IArtistObject } from './IArtistObject';
import { IHashtagLinkObject } from './IHashtagLinkObject';
import { IWorkLinkObject } from './ILinkObject';
import { IWebLinkObject } from './IWebLinkObject';

export interface IQuoteObject extends IEntryWithEntryType<EntryType.Quote> {
	id: number;
	createdAt: string;
	text: string;
	plainText: string;
	quoteType: QuoteType;
	locale: string;
	artist: IArtistObject;
	sourceUrl: string;
	hashtagLinks?: IHashtagLinkObject[];
	webLinks?: IWebLinkObject[];
	workLinks?: IWorkLinkObject[];
}
