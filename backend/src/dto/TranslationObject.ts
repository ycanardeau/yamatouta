import { Translation } from '../entities/Translation';
import { EntryType } from '../models/EntryType';
import { TranslationOptionalField } from '../models/translations/TranslationOptionalField';
import { WordCategory } from '../models/translations/WordCategory';
import { PermissionContext } from '../services/PermissionContext';
import { WorkLinkObject } from './LinkObject';
import { WebLinkObject } from './WebLinkObject';

export class TranslationObject {
	private constructor(
		readonly id: number,
		readonly entryType: EntryType.Translation,
		readonly createdAt: Date,
		readonly headword: string,
		readonly locale: string,
		readonly reading: string,
		readonly yamatokotoba: string,
		readonly category?: WordCategory,
		readonly webLinks?: WebLinkObject[],
		readonly workLinks?: WorkLinkObject[],
	) {}

	static create(
		translation: Translation,
		permissionContext: PermissionContext,
		fields: TranslationOptionalField[] = [],
	): TranslationObject {
		permissionContext.verifyDeletedAndHidden(translation);

		const webLinks = fields.includes(TranslationOptionalField.WebLinks)
			? translation.webLinks
					.getItems()
					.map((webLink) => WebLinkObject.create(webLink))
			: undefined;

		const workLinks = fields.includes(TranslationOptionalField.WorkLinks)
			? translation.workLinks
					.getItems()
					.map((workLink) =>
						WorkLinkObject.create(workLink, permissionContext),
					)
			: undefined;

		return new TranslationObject(
			translation.id,
			translation.entryType,
			translation.createdAt,
			translation.translatedString.headword,
			translation.translatedString.locale,
			translation.translatedString.reading,
			translation.translatedString.yamatokotoba,
			translation.category,
			webLinks,
			workLinks,
		);
	}
}
