import { IWorkLinkObject } from '@/dto/ILinkObject';
import { ITranslationObject } from '@/dto/ITranslationObject';
import { IWebLinkObject } from '@/dto/IWebLinkObject';
import { EntryType } from '@/models/EntryType';
import { LinkType } from '@/models/LinkType';
import { WordCategory } from '@/models/translations/WordCategory';

export class TranslationDetailsObject {
	private constructor(
		readonly id: number,
		readonly entryType: EntryType.Translation,
		readonly createdAt: string,
		readonly headword: string,
		readonly locale: string,
		readonly reading: string,
		readonly yamatokotoba: string,
		readonly category: WordCategory,
		readonly webLinks: IWebLinkObject[],
		readonly sources: IWorkLinkObject[],
	) {}

	static create(
		translation: Required<ITranslationObject>,
	): TranslationDetailsObject {
		return new TranslationDetailsObject(
			translation.id,
			translation.entryType,
			translation.createdAt,
			translation.headword,
			translation.locale,
			translation.reading,
			translation.yamatokotoba,
			translation.category,
			translation.webLinks,
			translation.workLinks.filter(
				(workLink) =>
					workLink.linkType === LinkType.Translation_Work_Source,
			),
		);
	}
}
