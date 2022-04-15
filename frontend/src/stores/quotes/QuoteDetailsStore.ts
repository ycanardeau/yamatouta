import { action, makeObservable, observable } from 'mobx';

import { IQuoteObject } from '../../dto/quotes/IQuoteObject';

export class QuoteDetailsStore {
	@observable quote: IQuoteObject;

	constructor(quote: IQuoteObject) {
		makeObservable(this);

		this.quote = quote;
	}

	@action setQuote = (value: IQuoteObject): void => {
		this.quote = value;
	};
}
