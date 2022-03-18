import { Translation } from '../entities/Translation';
import { WordCategory } from './WordCategory';

export class TranslationSnapshot {
	readonly headword: string;
	readonly locale: string;
	readonly reading: string;
	readonly yamatokotoba: string;
	readonly category: WordCategory;
	readonly tags: string[];

	constructor({ translation }: { translation: Translation }) {
		this.headword = translation.headword;
		this.locale = translation.locale;
		this.reading = translation.reading;
		this.yamatokotoba = translation.yamatokotoba;
		this.category = translation.category;
		this.tags = translation.tags;
	}
}

export type Snapshot = TranslationSnapshot;
