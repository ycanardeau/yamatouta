import { NotFoundException } from '@nestjs/common';

import { ChangeLogEntry } from '../entities/ChangeLogEntry';
import { ChangeLogEvent } from '../models/ChangeLogEvent';
import { EntryType } from '../models/EntryType';
import { Permission } from '../models/Permission';
import { PermissionContext } from '../services/PermissionContext';
import { UserObject } from './users/UserObject';

export class ChangeLogEntryObject {
	readonly createdAt: Date;
	readonly actor: UserObject;
	readonly actionType: ChangeLogEvent;
	//readonly changeKeys: ChangeLogChangeKey[];
	readonly entryType: EntryType;

	constructor(
		changeLogEntry: ChangeLogEntry,
		permissionContext: PermissionContext,
	) {
		if (!permissionContext.hasPermission(Permission.ViewEditHistory))
			throw new NotFoundException();

		this.createdAt = changeLogEntry.createdAt;
		this.actor = new UserObject(changeLogEntry.actor, permissionContext);
		this.actionType = changeLogEntry.actionType;
		/*this.changeKeys = changeLogEntry.changes
			.getItems()
			.map((change) => change.key);*/
		this.entryType = changeLogEntry.entryType;
	}
}
