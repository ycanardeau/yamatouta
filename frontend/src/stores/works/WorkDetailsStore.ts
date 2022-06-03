import { WorkDetailsObject } from '../../dto/WorkDetailsObject';
import { QuoteSearchStore } from '../quotes/QuoteSearchStore';

export class WorkDetailsStore {
	readonly quoteSearchStore = new QuoteSearchStore();

	constructor(readonly work: WorkDetailsObject) {
		this.quoteSearchStore.workId = work.id;
	}
}
