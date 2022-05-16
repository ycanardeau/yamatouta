import { Translation } from '../../entities/Translation';
import { IContentEquatable } from '../IContentEquatable';
import { WordCategory } from '../WordCategory';
import { WebLinkSnapshot } from './WebLinkSnapshot';

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
