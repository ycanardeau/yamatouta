import { Artist } from '../entities/Artist';
import { Quote } from '../entities/Quote';
import { Translation } from '../entities/Translation';
import { Work } from '../entities/Work';
import { ArtistType } from './ArtistType';
import { QuoteType } from './QuoteType';
import { WordCategory } from './WordCategory';
import { WorkType } from './WorkType';

export class TranslationSnapshot {
	readonly headword: string;
	readonly locale: string;
	readonly reading: string;
	readonly yamatokotoba: string;
	readonly category: WordCategory;
	readonly inishienomanabi_tags: string[];

	constructor(translation: Translation) {
		this.headword = translation.headword;
		this.locale = translation.locale;
		this.reading = translation.reading;
		this.yamatokotoba = translation.yamatokotoba;
		this.category = translation.category;
		this.inishienomanabi_tags = translation.inishienomanabi_tags;
	}
}

export class ArtistSnapshot {
	readonly name: string;
	readonly artistType: ArtistType;

	constructor(artist: Artist) {
		this.name = artist.name;
		this.artistType = artist.artistType;
	}
}

export class ObjectRefSnapshot<TEntry extends { id: number }> {
	readonly id: number;

	constructor(entry: TEntry) {
		this.id = entry.id;
	}
}

export class QuoteSnapshot {
	readonly text: string;
	readonly quoteType: QuoteType;
	readonly locale: string;
	readonly artist: ObjectRefSnapshot<Artist>;

	constructor(quote: Quote) {
		this.text = quote.text;
		this.quoteType = quote.quoteType;
		this.locale = quote.locale;
		this.artist = new ObjectRefSnapshot<Artist>(quote.artist);
	}
}

export class WorkSnapshot {
	readonly name: string;
	readonly workType: WorkType;

	constructor(work: Work) {
		this.name = work.name;
		this.workType = work.workType;
	}
}

export type Snapshot =
	| TranslationSnapshot
	| ArtistSnapshot
	| QuoteSnapshot
	| WorkSnapshot;
