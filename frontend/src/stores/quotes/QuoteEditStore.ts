import {
	action,
	computed,
	makeObservable,
	observable,
	runInAction,
} from 'mobx';

import { artistApi } from '../../api/artistApi';
import { quoteApi } from '../../api/quoteApi';
import { IArtistObject } from '../../dto/IArtistObject';
import { IQuoteObject } from '../../dto/IQuoteObject';
import { QuoteType } from '../../models/QuoteType';
import { BasicEntryLinkStore } from '../BasicEntryLinkStore';
import { WebLinkListEditStore } from '../WebLinkListEditStore';

export class QuoteEditStore {
	@observable submitting = false;
	@observable text = '';
	@observable quoteType = QuoteType.Tanka;
	@observable locale = 'ja';
	readonly artist = new BasicEntryLinkStore<IArtistObject>((id) =>
		artistApi.get({ id: id }),
	);
	readonly webLinks: WebLinkListEditStore;

	constructor(private readonly quote?: IQuoteObject) {
		makeObservable(this);

		if (quote) {
			this.text = quote.text;
			this.quoteType = quote.quoteType;
			this.locale = quote.locale;
			this.artist.loadEntryById(quote.artist.id);
			this.webLinks = new WebLinkListEditStore(quote.webLinks);
		} else {
			this.webLinks = new WebLinkListEditStore([]);
		}
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

			const createOrUpdate = this.quote
				? quoteApi.update
				: quoteApi.create;

			// Await.
			const quote = await createOrUpdate({
				id: this.quote?.id ?? 0,
				text: this.text,
				quoteType: this.quoteType,
				locale: this.locale,
				artistId: this.artist.entry?.id ?? 0,
				webLinks: this.webLinks.items,
			});

			return quote;
		} finally {
			runInAction(() => {
				this.submitting = false;
			});
		}
	};
}
