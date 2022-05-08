import { Translation } from '../entities/Translation';
import { TranslationOptionalField } from '../models/translations/TranslationOptionalField';
import { WordCategory } from '../models/translations/WordCategory';
import { PermissionContext } from '../services/PermissionContext';
import { WorkLinkObject } from './LinkObject';
import { WebLinkObject } from './WebLinkObject';

export class TranslationObject {
	readonly id: number;
	readonly createdAt: Date;
	readonly headword: string;
	readonly locale?: string;
	readonly reading?: string;
	readonly yamatokotoba: string;
	readonly category?: WordCategory;
	readonly webLinks?: WebLinkObject[];
	readonly workLinks?: WorkLinkObject[];

	constructor(
		translation: Translation,
		permissionContext: PermissionContext,
		fields: TranslationOptionalField[] = [],
	) {
		permissionContext.verifyDeletedAndHidden(translation);

		this.id = translation.id;
		this.createdAt = translation.createdAt;
		this.headword = translation.translatedString.headword;
		this.locale = translation.translatedString.locale;
		this.reading = translation.translatedString.reading;
		this.yamatokotoba = translation.translatedString.yamatokotoba;
		this.category = translation.category;
		this.webLinks = fields.includes(TranslationOptionalField.WebLinks)
			? translation.webLinks
					.getItems()
					.map((webLink) => new WebLinkObject(webLink))
			: undefined;
		this.workLinks = fields.includes(TranslationOptionalField.WorkLinks)
			? translation.workLinks
					.getItems()
					.map(
						(workLink) =>
							new WorkLinkObject(workLink, permissionContext),
					)
			: undefined;
	}
}
