import { NotFoundException } from '@nestjs/common';

import { User } from '../entities/User';
import { Permission } from '../models/Permission';
import { generateGravatarUrl } from '../utils/generateGravatarUrl';

export class AuthenticatedUserObject {
	readonly id: number;
	readonly deleted: boolean;
	readonly hidden: boolean;
	readonly name: string;
	readonly avatarUrl: string;
	readonly effectivePermissions: Permission[];

	constructor(user: User) {
		if (user.deleted || user.hidden) throw new NotFoundException();

		this.id = user.id;
		this.deleted = user.deleted;
		this.hidden = user.hidden;
		this.name = user.name;
		this.avatarUrl = generateGravatarUrl(user.email);
		this.effectivePermissions = user.effectivePermissions;
	}
}
