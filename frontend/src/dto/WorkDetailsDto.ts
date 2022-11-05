import { IArtistLinkDto } from '@/dto/ILinkDto';
import { IWebLinkDto } from '@/dto/IWebLinkDto';
import { IWorkDto } from '@/dto/IWorkDto';
import { EntryType } from '@/models/EntryType';
import { LinkType } from '@/models/LinkType';
import { WorkType } from '@/models/works/WorkType';

export class WorkDetailsDto {
	private constructor(
		readonly id: number,
		readonly entryType: EntryType.Work,
		readonly name: string,
		readonly workType: WorkType,
		readonly webLinks: IWebLinkDto[],
		readonly authors: IArtistLinkDto[],
		readonly editors: IArtistLinkDto[],
		readonly publishers: IArtistLinkDto[],
		readonly translators: IArtistLinkDto[],
	) {}

	static create(work: Required<IWorkDto>): WorkDetailsDto {
		return new WorkDetailsDto(
			work.id,
			work.entryType,
			work.name,
			work.workType,
			work.webLinks,
			work.artistLinks.filter(
				(artistLink) =>
					artistLink.linkType === LinkType.Work_Artist_Author,
			),
			work.artistLinks.filter(
				(artistLink) =>
					artistLink.linkType === LinkType.Work_Artist_Editor,
			),
			work.artistLinks.filter(
				(artistLink) =>
					artistLink.linkType === LinkType.Work_Artist_Publisher,
			),
			work.artistLinks.filter(
				(artistLink) =>
					artistLink.linkType === LinkType.Work_Artist_Translator,
			),
		);
	}
}
