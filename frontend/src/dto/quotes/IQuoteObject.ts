import { IArtistObject } from '../artists/IArtistObject';

export interface IQuoteObject {
	id: number;
	createdAt: Date;
	phrases: string[];
	artist: IArtistObject;
	sourceUrl?: string;
}
