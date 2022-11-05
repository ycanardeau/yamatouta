import { ArtistDetailsDto } from '@/dto/ArtistDetailsDto';
import { QuoteSortRule } from '@/models/quotes/QuoteSortRule';
import { QuoteSearchStore } from '@/stores/quotes/QuoteSearchStore';

export class ArtistDetailsStore {
	readonly quoteSearchStore = new QuoteSearchStore(QuoteSortRule.UpdatedDesc);

	constructor(readonly artist: ArtistDetailsDto) {
		this.quoteSearchStore.artistId = artist.id;
	}
}
