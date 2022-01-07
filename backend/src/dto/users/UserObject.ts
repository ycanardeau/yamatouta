import { NotFoundException } from '@nestjs/common';

import { User } from '../../entities/User';
import { PermissionContext } from '../../services/PermissionContext';

export class UserObject {
	readonly id: number;
	readonly deleted: boolean;
	readonly hidden: boolean;
	readonly name: string;

	constructor(user: User, permissionContext: PermissionContext) {
		if (user.deleted && !permissionContext.canViewDeletedEntries)
			throw new NotFoundException();

		if (user.hidden && !permissionContext.canViewHiddenEntries)
			throw new NotFoundException();

		this.id = user.id;
		this.deleted = user.deleted;
		this.hidden = user.hidden;
		this.name = user.name;
	}
}
