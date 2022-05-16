import {
	action,
	computed,
	makeObservable,
	observable,
	runInAction,
} from 'mobx';

import { deleteQuote } from '../../api/QuoteApi';
import { IQuoteObject } from '../../dto/IQuoteObject';

export class QuoteDeleteStore {
	private readonly quote: IQuoteObject;
	@observable submitting = false;

	constructor({ quote }: { quote: IQuoteObject }) {
		makeObservable(this);

		this.quote = quote;
	}

	@computed get isValid(): boolean {
		return true;
	}

	@action submit = async (): Promise<void> => {
		try {
			this.submitting = true;

			await deleteQuote({ quoteId: this.quote.id });
		} finally {
			runInAction(() => {
				this.submitting = false;
			});
		}
	};
}
