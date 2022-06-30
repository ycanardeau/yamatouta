import { WorkDetailsObject } from '../../dto/WorkDetailsObject';
import { QuoteSortRule } from '../../models/quotes/QuoteSortRule';
import { QuoteSearchStore } from '../quotes/QuoteSearchStore';

export class WorkDetailsStore {
	readonly quoteSearchStore = new QuoteSearchStore(QuoteSortRule.UpdatedDesc);

	constructor(readonly work: WorkDetailsObject) {
		this.quoteSearchStore.workId = work.id;
	}
}
