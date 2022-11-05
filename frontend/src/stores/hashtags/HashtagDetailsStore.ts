import { HashtagDetailsObject } from '@/dto/HashtagDetailsObject';
import { QuoteSortRule } from '@/models/quotes/QuoteSortRule';
import { QuoteSearchStore } from '@/stores/quotes/QuoteSearchStore';

export class HashtagDetailsStore {
	readonly quoteSearchStore = new QuoteSearchStore(QuoteSortRule.UpdatedDesc);

	constructor(readonly hashtag: HashtagDetailsObject) {}
}
