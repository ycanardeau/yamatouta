import { ArtistLinkDto } from '@/dto/LinkDto';
import { WebLinkDto } from '@/dto/WebLinkDto';
import { Work } from '@/entities/Work';
import { EntryType } from '@/models/EntryType';
import { WorkOptionalField } from '@/models/works/WorkOptionalField';
import { WorkType } from '@/models/works/WorkType';
import { PermissionContext } from '@/services/PermissionContext';

export class WorkDto {
	_workDtoBrand: any;

	private constructor(
		readonly id: number,
		readonly entryType: EntryType.Work,
		readonly deleted: boolean,
		readonly hidden: boolean,
		readonly name: string,
		readonly workType: WorkType,
		readonly webLinks?: WebLinkDto[],
		readonly artistLinks?: ArtistLinkDto[],
	) {}

	static create(
		permissionContext: PermissionContext,
		work: Work,
		fields: WorkOptionalField[] = [],
	): WorkDto {
		permissionContext.verifyDeletedAndHidden(work);

		const webLinks = fields.includes(WorkOptionalField.WebLinks)
			? work.webLinks
					.getItems()
					.map((webLink) => WebLinkDto.create(webLink))
			: undefined;

		const artistLinks = fields.includes(WorkOptionalField.ArtistLinks)
			? work.artistLinks
					.getItems()
					.map((artistLink) =>
						ArtistLinkDto.create(permissionContext, artistLink),
					)
			: undefined;

		return new WorkDto(
			work.id,
			work.entryType,
			work.deleted,
			work.hidden,
			work.name,
			work.workType,
			webLinks,
			artistLinks,
		);
	}
}
