import { NotFoundException } from '@nestjs/common';

import { Revision } from '../entities/Revision';
import { Entry } from '../models/Entry';
import { Permission } from '../models/Permission';
import { RevisionEvent } from '../models/RevisionEvent';
import { Snapshot } from '../models/snapshots/Snapshot';
import { PermissionContext } from '../services/PermissionContext';
import { UserObject } from './UserObject';

export class RevisionObject {
	private constructor(
		readonly createdAt: Date,
		readonly actor: UserObject,
		readonly event: RevisionEvent,
	) {}

	static create(
		revision: Revision<Entry, Snapshot>,
		permissionContext: PermissionContext,
	): RevisionObject {
		if (!permissionContext.hasPermission(Permission.ViewRevisions))
			throw new NotFoundException();

		permissionContext.verifyDeletedAndHidden(revision.entry);

		return new RevisionObject(
			revision.createdAt,
			UserObject.create(revision.actor.getEntity(), permissionContext),
			revision.event,
		);
	}
}
