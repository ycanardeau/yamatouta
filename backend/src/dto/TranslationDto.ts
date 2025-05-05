import { WorkLinkDto } from '@/dto/LinkDto';
import { WebLinkDto } from '@/dto/WebLinkDto';
import { Translation } from '@/entities/Translation';
import { EntryType } from '@/models/EntryType';
import { TranslationOptionalField } from '@/models/translations/TranslationOptionalField';
import { WordCategory } from '@/models/translations/WordCategory';
import { PermissionContext } from '@/services/PermissionContext';

export class TranslationDto {
	_translationDtoBrand: any;

	private constructor(
		readonly id: number,
		readonly entryType: EntryType.Translation,
		readonly createdAt: Date,
		readonly updatedAt: Date,
		readonly headword: string,
		readonly locale: string,
		readonly reading: string,
		readonly yamatokotoba: string,
		readonly category: WordCategory,
		readonly inishienomanabi_tags: string[],
		readonly actorId: number,
		readonly webLinks?: WebLinkDto[],
		readonly workLinks?: WorkLinkDto[],
	) {}

	static create(
		permissionContext: PermissionContext,
		translation: Translation,
		fields: TranslationOptionalField[] = [],
	): TranslationDto {
		permissionContext.verifyDeletedAndHidden(translation);

		const webLinks = fields.includes(TranslationOptionalField.WebLinks)
			? translation.webLinks
					.getItems()
					.map((webLink) => WebLinkDto.create(webLink))
			: undefined;

		const workLinks = fields.includes(TranslationOptionalField.WorkLinks)
			? translation.workLinks
					.getItems()
					.map((workLink) =>
						WorkLinkDto.create(workLink, permissionContext),
					)
			: undefined;

		return new TranslationDto(
			translation.id,
			translation.entryType,
			translation.createdAt,
			translation.updatedAt,
			translation.translatedString.headword,
			translation.translatedString.locale,
			translation.translatedString.reading,
			translation.translatedString.yamatokotoba,
			translation.category,
			translation.inishienomanabi_tags,
			translation.actor.id,
			webLinks,
			workLinks,
		);
	}
}
