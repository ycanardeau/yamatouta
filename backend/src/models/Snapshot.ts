import { Artist } from '../entities/Artist';
import { Quote } from '../entities/Quote';
import { Translation } from '../entities/Translation';
import { WebLink } from '../entities/WebLink';
import { Work } from '../entities/Work';
import { ArtistType } from './ArtistType';
import { IContentEquatable } from './IContentEquatable';
import { QuoteType } from './QuoteType';
import { WebLinkCategory } from './WebLinkCategory';
import { WordCategory } from './WordCategory';
import { WorkType } from './WorkType';

export class WebLinkSnapshot {
	readonly url: string;
	readonly title: string;
	readonly category: WebLinkCategory;

	constructor(webLink: WebLink) {
		this.url = webLink.url;
		this.title = webLink.title;
		this.category = webLink.category;
	}
}

export type ITranslationSnapshot = Omit<TranslationSnapshot, 'contentEquals'>;

export class TranslationSnapshot
	implements IContentEquatable<ITranslationSnapshot>
{
	readonly headword: string;
	readonly locale: string;
	readonly reading: string;
	readonly yamatokotoba: string;
	readonly category: WordCategory;
	readonly inishienomanabi_tags: string[];
	readonly webLinks: WebLinkSnapshot[];

	constructor(translation: Translation) {
		this.headword = translation.headword;
		this.locale = translation.locale;
		this.reading = translation.reading;
		this.yamatokotoba = translation.yamatokotoba;
		this.category = translation.category;
		this.inishienomanabi_tags = translation.inishienomanabi_tags;
		this.webLinks = translation.webLinks
			.getItems()
			.map((webLink) => new WebLinkSnapshot(webLink));
	}

	contentEquals(other: ITranslationSnapshot): boolean {
		return JSON.stringify(this) === JSON.stringify(other);
	}
}

export type IArtistSnapshot = Omit<ArtistSnapshot, 'contentEquals'>;

export class ArtistSnapshot implements IContentEquatable<IArtistSnapshot> {
	readonly name: string;
	readonly artistType: ArtistType;
	readonly webLinks: WebLinkSnapshot[];

	constructor(artist: Artist) {
		this.name = artist.name;
		this.artistType = artist.artistType;
		this.webLinks = artist.webLinks
			.getItems()
			.map((webLink) => new WebLinkSnapshot(webLink));
	}

	contentEquals(other: IArtistSnapshot): boolean {
		return JSON.stringify(this) === JSON.stringify(other);
	}
}

export class ObjectRefSnapshot<TEntry extends { id: number }> {
	readonly id: number;

	constructor(entry: TEntry) {
		this.id = entry.id;
	}
}

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

export type IWorkSnapshot = Omit<WorkSnapshot, 'contentEquals'>;

export class WorkSnapshot implements IContentEquatable<IWorkSnapshot> {
	readonly name: string;
	readonly workType: WorkType;
	readonly webLinks: WebLinkSnapshot[];

	constructor(work: Work) {
		this.name = work.name;
		this.workType = work.workType;
		this.webLinks = work.webLinks
			.getItems()
			.map((webLink) => new WebLinkSnapshot(webLink));
	}

	contentEquals(other: IWorkSnapshot): boolean {
		return JSON.stringify(this) === JSON.stringify(other);
	}
}

export type Snapshot =
	| TranslationSnapshot
	| ArtistSnapshot
	| QuoteSnapshot
	| WorkSnapshot;
