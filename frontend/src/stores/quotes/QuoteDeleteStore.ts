import {
	action,
	computed,
	makeObservable,
	observable,
	runInAction,
} from 'mobx';

import { quoteApi } from '../../api/quoteApi';
import { IQuoteObject } from '../../dto/IQuoteObject';

export class QuoteDeleteStore {
	@observable submitting = false;

	constructor(private readonly quote: IQuoteObject) {
		makeObservable(this);
	}

	@computed get isValid(): boolean {
		return true;
	}

	@action submit = async (): Promise<void> => {
		try {
			this.submitting = true;

			await quoteApi.delete({ id: this.quote.id });
		} finally {
			runInAction(() => {
				this.submitting = false;
			});
		}
	};
}
