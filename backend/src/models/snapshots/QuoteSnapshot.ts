import { Artist } from '../../entities/Artist';
import { Quote } from '../../entities/Quote';
import { IContentEquatable } from '../IContentEquatable';
import { QuoteType } from '../QuoteType';
import { ObjectRefSnapshot } from './ObjectRefSnapshot';
import { WebLinkSnapshot } from './WebLinkSnapshot';

export type IQuoteSnapshot = Omit<QuoteSnapshot, 'contentEquals'>;

export class QuoteSnapshot implements IContentEquatable<IQuoteSnapshot> {
	readonly text: string;
	readonly quoteType: QuoteType;
	readonly locale: string;
	readonly artist: ObjectRefSnapshot<Artist>;
	readonly webLinks: WebLinkSnapshot[];

	constructor(quote: Quote) {
		this.text = quote.text;
		this.quoteType = quote.quoteType;
		this.locale = quote.locale;
		this.artist = new ObjectRefSnapshot<Artist>(quote.artist);
		this.webLinks = quote.webLinks
			.getItems()
			.map((webLink) => new WebLinkSnapshot(webLink));
	}

	contentEquals(other: IQuoteSnapshot): boolean {
		return JSON.stringify(this) === JSON.stringify(other);
	}
}
