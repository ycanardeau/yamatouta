import { IArtistObject } from '@/dto/IArtistObject';
import { IHashtagLinkObject } from '@/dto/IHashtagLinkObject';
import { IWorkLinkObject } from '@/dto/ILinkObject';
import { IWebLinkObject } from '@/dto/IWebLinkObject';
import { EntryType } from '@/models/EntryType';
import { IEntryWithEntryType } from '@/models/IEntryWithEntryType';
import { QuoteType } from '@/models/quotes/QuoteType';

export interface IQuoteObject extends IEntryWithEntryType<EntryType.Quote> {
	id: number;
	createdAt: string;
	text: string;
	plainText: string;
	transcription: string;
	quoteType: QuoteType;
	locale: string;
	artist: IArtistObject;
	sourceUrl: string;
	hashtagLinks?: IHashtagLinkObject[];
	webLinks?: IWebLinkObject[];
	workLinks?: IWorkLinkObject[];
}
