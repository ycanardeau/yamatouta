import { NotFoundException } from '@nestjs/common';

import { Translation } from '../../entities/Translation';
import { WordCategory } from '../../models/WordCategory';
import { PermissionContext } from '../../services/PermissionContext';

export class TranslationObject {
	readonly id: number;
	readonly headword: string;
	readonly locale?: string;
	readonly reading?: string;
	readonly yamatokotoba: string;
	readonly category?: WordCategory;

	constructor(
		translation: Translation,
		permissionContext: PermissionContext,
	) {
		if (translation.deleted && !permissionContext.canViewDeletedEntries)
			throw new NotFoundException();

		if (translation.hidden && !permissionContext.canViewHiddenEntries)
			throw new NotFoundException();

		this.id = translation.id;
		this.headword = translation.translatedString.headword;
		this.locale = translation.translatedString.locale;
		this.reading = translation.translatedString.reading;
		this.yamatokotoba = translation.translatedString.yamatokotoba;
		this.category = translation.category;
	}
}
