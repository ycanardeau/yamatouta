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
import { QuoteEditObject } from '../../dto/QuoteEditObject';
import { IQuoteUpdateParams } from '../../models/quotes/IQuoteUpdateParams';
import { QuoteType } from '../../models/quotes/QuoteType';
import { BasicEntryLinkStore } from '../BasicEntryLinkStore';
import { HashtagListEditStore } from '../HashtagListEditStore';
import { WebLinkListEditStore } from '../WebLinkListEditStore';
import { WorkLinkListEditStore } from '../WorkLinkListEditStore';

export class QuoteEditStore {
	@observable submitting = false;
	@observable text = '';
	@observable quoteType = QuoteType.Tanka;
	@observable locale = 'ja';
	readonly artist = new BasicEntryLinkStore<IArtistObject>((id) =>
		artistApi.get({ id: id }),
	);
	readonly hashtags: HashtagListEditStore;
	readonly webLinks: WebLinkListEditStore;
	readonly workLinks: WorkLinkListEditStore;

	constructor(private readonly quote?: QuoteEditObject) {
		makeObservable(this);

		if (quote) {
			this.text = quote.text;
			this.quoteType = quote.quoteType;
			this.locale = quote.locale;
			this.artist.loadEntryById(quote.artist.id);
			this.hashtags = new HashtagListEditStore([] /* TODO */);
			this.webLinks = new WebLinkListEditStore(quote.webLinks);
			this.workLinks = new WorkLinkListEditStore(quote.workLinks);
		} else {
			this.hashtags = new HashtagListEditStore([]);
			this.webLinks = new WebLinkListEditStore([]);
			this.workLinks = new WorkLinkListEditStore([]);
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

	toParams = (): IQuoteUpdateParams => {
		return {
			id: this.quote?.id ?? 0,
			text: this.text,
			quoteType: this.quoteType,
			locale: this.locale,
			artistId: this.artist.entry?.id ?? 0,
			hashtags: this.hashtags.toParams(),
			webLinks: this.webLinks.toParams(),
			workLinks: this.workLinks.toParams(),
		};
	};

	@action submit = async (): Promise<IQuoteObject> => {
		try {
			this.submitting = true;

			const createOrUpdate = this.quote
				? quoteApi.update
				: quoteApi.create;

			// Await.
			const quote = await createOrUpdate(this.toParams());

			return quote;
		} finally {
			runInAction(() => {
				this.submitting = false;
			});
		}
	};
}
