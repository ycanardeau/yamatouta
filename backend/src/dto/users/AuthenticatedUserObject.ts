import { NotFoundException } from '@nestjs/common';

import { User } from '../../entities/User';
import { Permission } from '../../models/Permission';

export class AuthenticatedUserObject {
	readonly id: number;
	readonly deleted: boolean;
	readonly hidden: boolean;
	readonly name: string;
	readonly effectivePermissions: Permission[];

	constructor(user: User) {
		if (user.deleted || user.hidden) throw new NotFoundException();

		this.id = user.id;
		this.deleted = user.deleted;
		this.hidden = user.hidden;
		this.name = user.name;
		this.effectivePermissions = user.effectivePermissions;
	}
}
