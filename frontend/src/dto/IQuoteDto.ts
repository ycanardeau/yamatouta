import { IArtistDto } from '@/dto/IArtistDto';
import { IHashtagLinkDto } from '@/dto/IHashtagLinkDto';
import { IWorkLinkDto } from '@/dto/ILinkDto';
import { IWebLinkDto } from '@/dto/IWebLinkDto';
import { EntryType } from '@/models/EntryType';
import { IEntryWithEntryType } from '@/models/IEntryWithEntryType';
import { QuoteType } from '@/models/quotes/QuoteType';

export interface IQuoteDto extends IEntryWithEntryType<EntryType.Quote> {
	id: number;
	createdAt: string;
	text: string;
	plainText: string;
	transcription: string;
	quoteType: QuoteType;
	locale: string;
	artist: IArtistDto;
	sourceUrl: string;
	hashtagLinks?: IHashtagLinkDto[];
	webLinks?: IWebLinkDto[];
	workLinks?: IWorkLinkDto[];
}
