import { QuoteIndexStore } from '../quotes/QuoteIndexStore';

export class ArtistDetailsStore {
	readonly quoteIndexStore: QuoteIndexStore;

	constructor(artistId: number) {
		this.quoteIndexStore = new QuoteIndexStore();
		this.quoteIndexStore.artistId = artistId;
	}
}
