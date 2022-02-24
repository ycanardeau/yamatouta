import { QuoteSearchStore } from '../quotes/QuoteSearchStore';

export class ArtistDetailsStore {
	readonly quoteSearchStore: QuoteSearchStore;

	constructor(artistId: number) {
		this.quoteSearchStore = new QuoteSearchStore();
		this.quoteSearchStore.artistId = artistId;
	}
}
