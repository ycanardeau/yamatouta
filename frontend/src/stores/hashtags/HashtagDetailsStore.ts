import { HashtagDetailsObject } from '../../dto/HashtagDetailsObject';
import { QuoteSearchStore } from '../quotes/QuoteSearchStore';

export class HashtagDetailsStore {
	readonly quoteSearchStore = new QuoteSearchStore();

	constructor(readonly hashtag: HashtagDetailsObject) {}
}
