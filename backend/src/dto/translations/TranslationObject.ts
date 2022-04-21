import { Translation } from '../../entities/Translation';
import { TranslationOptionalFields } from '../../models/TranslationOptionalFields';
import { WordCategory } from '../../models/WordCategory';
import { PermissionContext } from '../../services/PermissionContext';
import { WebLinkObject } from '../WebLinkObject';

export class TranslationObject {
	readonly id: number;
	readonly createdAt: Date;
	readonly headword: string;
	readonly locale?: string;
	readonly reading?: string;
	readonly yamatokotoba: string;
	readonly category?: WordCategory;
	readonly webLinks?: WebLinkObject[];

	constructor(
		translation: Translation,
		permissionContext: PermissionContext,
		fields: TranslationOptionalFields[] = [],
	) {
		permissionContext.verifyDeletedAndHidden(translation);

		this.id = translation.id;
		this.createdAt = translation.createdAt;
		this.headword = translation.translatedString.headword;
		this.locale = translation.translatedString.locale;
		this.reading = translation.translatedString.reading;
		this.yamatokotoba = translation.translatedString.yamatokotoba;
		this.category = translation.category;
		this.webLinks = fields.includes(TranslationOptionalFields.WebLinks)
			? translation.webLinks
					.getItems()
					.map((webLink) => new WebLinkObject(webLink))
			: undefined;
	}
}
