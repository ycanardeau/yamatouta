import { QuoteType } from '../../models/QuoteType';
import { IArtistObject } from '../artists/IArtistObject';

export interface IQuoteObject {
	id: number;
	createdAt: Date;
	text: string;
	quoteType: QuoteType;
	locale: string;
	artist: IArtistObject;
	sourceUrl: string;
}
