import { Work } from '../entities/Work';
import { EntryType } from '../models/EntryType';
import { WorkOptionalField } from '../models/works/WorkOptionalField';
import { WorkType } from '../models/works/WorkType';
import { PermissionContext } from '../services/PermissionContext';
import { ArtistLinkObject } from './LinkObject';
import { WebLinkObject } from './WebLinkObject';

export class WorkObject {
	private constructor(
		readonly id: number,
		readonly entryType: EntryType.Work,
		readonly deleted: boolean,
		readonly hidden: boolean,
		readonly name: string,
		readonly workType: WorkType,
		readonly webLinks?: WebLinkObject[],
		readonly artistLinks?: ArtistLinkObject[],
	) {}

	static create(
		work: Work,
		permissionContext: PermissionContext,
		fields: WorkOptionalField[] = [],
	): WorkObject {
		permissionContext.verifyDeletedAndHidden(work);

		const webLinks = fields.includes(WorkOptionalField.WebLinks)
			? work.webLinks
					.getItems()
					.map((webLink) => WebLinkObject.create(webLink))
			: undefined;

		const artistLinks = fields.includes(WorkOptionalField.ArtistLinks)
			? work.artistLinks
					.getItems()
					.map((artistLink) =>
						ArtistLinkObject.create(artistLink, permissionContext),
					)
			: undefined;

		return new WorkObject(
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
