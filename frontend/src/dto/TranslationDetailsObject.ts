import { WordCategory } from '../models/translations/WordCategory';
import { ITranslationObject } from './ITranslationObject';
import { IWebLinkObject } from './IWebLinkObject';

export class TranslationDetailsObject {
	private constructor(
		readonly id: number,
		readonly createdAt: string,
		readonly headword: string,
		readonly locale: string,
		readonly reading: string,
		readonly yamatokotoba: string,
		readonly category: WordCategory,
		readonly webLinks: IWebLinkObject[],
	) {}

	static create(
		translation: Required<ITranslationObject>,
	): TranslationDetailsObject {
		return new TranslationDetailsObject(
			translation.id,
			translation.createdAt,
			translation.headword,
			translation.locale,
			translation.reading,
			translation.yamatokotoba,
			translation.category,
			translation.webLinks,
		);
	}
}
