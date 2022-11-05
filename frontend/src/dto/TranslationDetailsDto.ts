import { IWorkLinkDto } from '@/dto/ILinkDto';
import { ITranslationDto } from '@/dto/ITranslationDto';
import { IWebLinkDto } from '@/dto/IWebLinkDto';
import { EntryType } from '@/models/EntryType';
import { LinkType } from '@/models/LinkType';
import { WordCategory } from '@/models/translations/WordCategory';

export class TranslationDetailsDto {
	private constructor(
		readonly id: number,
		readonly entryType: EntryType.Translation,
		readonly createdAt: string,
		readonly headword: string,
		readonly locale: string,
		readonly reading: string,
		readonly yamatokotoba: string,
		readonly category: WordCategory,
		readonly webLinks: IWebLinkDto[],
		readonly sources: IWorkLinkDto[],
	) {}

	static create(
		translation: Required<ITranslationDto>,
	): TranslationDetailsDto {
		return new TranslationDetailsDto(
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
