import { ArtistDetailsObject } from '@/dto/ArtistDetailsObject';
import { QuoteSortRule } from '@/models/quotes/QuoteSortRule';
import { QuoteSearchStore } from '@/stores/quotes/QuoteSearchStore';

export class ArtistDetailsStore {
	readonly quoteSearchStore = new QuoteSearchStore(QuoteSortRule.UpdatedDesc);

	constructor(readonly artist: ArtistDetailsObject) {
		this.quoteSearchStore.artistId = artist.id;
	}
}
