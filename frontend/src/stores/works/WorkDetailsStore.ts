import { WorkDetailsDto } from '@/dto/WorkDetailsDto';
import { QuoteSortRule } from '@/models/quotes/QuoteSortRule';
import { QuoteSearchStore } from '@/stores/quotes/QuoteSearchStore';

export class WorkDetailsStore {
	readonly quoteSearchStore = new QuoteSearchStore(QuoteSortRule.UpdatedDesc);

	constructor(readonly work: WorkDetailsDto) {
		this.quoteSearchStore.workId = work.id;
	}
}
