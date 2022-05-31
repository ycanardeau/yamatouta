import { ArtistDetailsObject } from '../../dto/ArtistDetailsObject';
import { QuoteSearchStore } from '../quotes/QuoteSearchStore';

export class ArtistDetailsStore {
	readonly quoteSearchStore = new QuoteSearchStore();

	constructor(readonly artist: ArtistDetailsObject) {
		this.quoteSearchStore.artistId = artist.id;
	}
}
