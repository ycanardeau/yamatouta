import {
	action,
	computed,
	makeObservable,
	observable,
	runInAction,
} from 'mobx';

import { IQuoteObject } from '../../dto/quotes/IQuoteObject';
import { QuoteType } from '../../models/QuoteType';

export class EditQuoteDialogStore {
	private readonly quote?: IQuoteObject;
	@observable submitting = false;
	@observable text = '';
	@observable quoteType = QuoteType.Tanka;

	constructor({ quote }: { quote?: IQuoteObject }) {
		makeObservable(this);

		this.quote = quote;
	}

	@computed get isValid(): boolean {
		return !!this.text && !!this.quoteType;
	}

	@action setText = (value: string): void => {
		this.text = value;
	};

	@action setQuoteType = (value: QuoteType): void => {
		this.quoteType = value;
	};

	@action submit = async (): Promise<IQuoteObject> => {
		try {
			this.submitting = true;

			// TODO: Implement.
			throw new Error();
		} finally {
			runInAction(() => {
				this.submitting = false;
			});
		}
	};
}
