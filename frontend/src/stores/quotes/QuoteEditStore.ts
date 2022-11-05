import { artistApi } from '@/api/artistApi';
import { quoteApi } from '@/api/quoteApi';
import { IArtistObject } from '@/dto/IArtistObject';
import { IQuoteObject } from '@/dto/IQuoteObject';
import { QuoteEditObject } from '@/dto/QuoteEditObject';
import { IQuoteUpdateParams } from '@/models/quotes/IQuoteUpdateParams';
import { QuoteType } from '@/models/quotes/QuoteType';
import { BasicEntryLinkStore } from '@/stores/BasicEntryLinkStore';
import { WebLinkListEditStore } from '@/stores/WebLinkListEditStore';
import { WorkLinkListEditStore } from '@/stores/WorkLinkListEditStore';
import {
	action,
	computed,
	makeObservable,
	observable,
	runInAction,
} from 'mobx';

export class QuoteEditStore {
	@observable submitting = false;
	@observable text = '';
	@observable quoteType: QuoteType | '' = '';
	@observable locale = 'ja';
	readonly artist = new BasicEntryLinkStore<IArtistObject>((id) =>
		artistApi.get({ id: id }),
	);
	readonly webLinks: WebLinkListEditStore;
	readonly workLinks: WorkLinkListEditStore;

	constructor(private readonly quote?: QuoteEditObject) {
		makeObservable(this);

		if (quote) {
			this.text = quote.text;
			this.quoteType = quote.quoteType;
			this.locale = quote.locale;
			this.artist.loadEntryById(quote.artist.id);
			this.webLinks = new WebLinkListEditStore(quote.webLinks);
			this.workLinks = new WorkLinkListEditStore(quote.workLinks);
		} else {
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
		if (!this.quoteType) throw new Error('quoteType is empty');

		return {
			id: this.quote?.id ?? 0,
			text: this.text,
			quoteType: this.quoteType,
			locale: this.locale,
			artistId: this.artist.entry?.id ?? 0,
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
