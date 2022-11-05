import { quoteApi } from '@/api/quoteApi';
import { IQuoteDto } from '@/dto/IQuoteDto';
import {
	action,
	computed,
	makeObservable,
	observable,
	runInAction,
} from 'mobx';

export class QuoteDeleteStore {
	@observable submitting = false;

	constructor(private readonly quote: IQuoteDto) {
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
