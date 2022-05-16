import { action, makeObservable, observable } from 'mobx';

import { IArtistObject } from '../../dto/IArtistObject';
import { QuoteSearchStore } from '../quotes/QuoteSearchStore';

export class ArtistDetailsStore {
	@observable artist: IArtistObject;
	readonly quoteSearchStore: QuoteSearchStore;

	constructor(artist: IArtistObject) {
		makeObservable(this);

		this.artist = artist;

		this.quoteSearchStore = new QuoteSearchStore();
		this.quoteSearchStore.artistId = artist.id;
	}

	@action setArtist = (value: IArtistObject): void => {
		this.artist = value;
	};
}
