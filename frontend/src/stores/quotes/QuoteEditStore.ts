import {
	action,
	computed,
	makeObservable,
	observable,
	runInAction,
} from 'mobx';

import { getArtist } from '../../api/ArtistApi';
import { createQuote, updateQuote } from '../../api/QuoteApi';
import { IArtistObject } from '../../dto/artists/IArtistObject';
import { IQuoteObject } from '../../dto/quotes/IQuoteObject';
import { QuoteType } from '../../models/QuoteType';
import { BasicEntryLinkStore } from '../BasicEntryLinkStore';
import { WebLinkListEditStore } from '../WebLinkListEditStore';

export class QuoteEditStore {
	private readonly quote?: IQuoteObject;
	@observable submitting = false;
	@observable text = '';
	@observable quoteType = QuoteType.Tanka;
	@observable locale = 'ja';
	readonly artist = new BasicEntryLinkStore<IArtistObject>((entryId) =>
		getArtist({ artistId: entryId }),
	);
	readonly webLinks: WebLinkListEditStore;

	constructor(quote?: IQuoteObject) {
		makeObservable(this);

		this.quote = quote;

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

			const params = {
				text: this.text,
				quoteType: this.quoteType,
				locale: this.locale,
				artistId: this.artist.entry?.id ?? 0,
				webLinks: this.webLinks.items,
			};

			// Await.
			const quote = await (this.quote
				? updateQuote({ ...params, quoteId: this.quote.id })
				: createQuote(params));

			return quote;
		} finally {
			runInAction(() => {
				this.submitting = false;
			});
		}
	};
}
