import { NotFoundException } from '@nestjs/common';

import { Revision } from '../../entities/Revision';
import { Entry } from '../../models/Entry';
import { Permission } from '../../models/Permission';
import { RevisionEvent } from '../../models/RevisionEvent';
import { Snapshot } from '../../models/Snapshot';
import { PermissionContext } from '../../services/PermissionContext';
import { UserObject } from '../users/UserObject';

export class RevisionObject {
	readonly createdAt: Date;
	readonly actor: UserObject;
	readonly event: RevisionEvent;

	constructor(
		revision: Revision<Entry, Snapshot>,
		permissionContext: PermissionContext,
	) {
		if (!permissionContext.hasPermission(Permission.ViewEditHistory))
			throw new NotFoundException();

		permissionContext.verifyDeletedAndHidden(revision.entry);

		this.createdAt = revision.createdAt;
		this.actor = new UserObject(revision.actor, permissionContext);
		this.event = revision.event;
	}
}
