import { Work } from '../../entities/Work';
import { WorkType } from '../../models/WorkType';
import { PermissionContext } from '../../services/PermissionContext';

export class WorkObject {
	readonly id: number;
	readonly deleted: boolean;
	readonly hidden: boolean;
	readonly name: string;
	readonly workType: WorkType;

	constructor(work: Work, permissionContext: PermissionContext) {
		permissionContext.verifyDeletedAndHidden(work);

		this.id = work.id;
		this.deleted = work.deleted;
		this.hidden = work.hidden;
		this.name = work.name;
		this.workType = work.workType;
	}
}
