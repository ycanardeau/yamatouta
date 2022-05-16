import { Work } from '../entities/Work';
import { WorkOptionalField } from '../models/WorkOptionalField';
import { WorkType } from '../models/WorkType';
import { PermissionContext } from '../services/PermissionContext';
import { WebLinkObject } from './WebLinkObject';

export class WorkObject {
	readonly id: number;
	readonly deleted: boolean;
	readonly hidden: boolean;
	readonly name: string;
	readonly workType: WorkType;
	readonly webLinks?: WebLinkObject[];

	constructor(
		work: Work,
		permissionContext: PermissionContext,
		fields: WorkOptionalField[] = [],
	) {
		permissionContext.verifyDeletedAndHidden(work);

		this.id = work.id;
		this.deleted = work.deleted;
		this.hidden = work.hidden;
		this.name = work.name;
		this.workType = work.workType;
		this.webLinks = fields.includes(WorkOptionalField.WebLinks)
			? work.webLinks
					.getItems()
					.map((webLink) => new WebLinkObject(webLink))
			: undefined;
	}
}
