import { NotFoundException } from '@nestjs/common';

import { User } from '../entities/User';
import { Permission } from '../models/Permission';

export class AuthenticatedUserObject {
	private constructor(
		readonly id: number,
		readonly deleted: boolean,
		readonly hidden: boolean,
		readonly name: string,
		readonly avatarUrl: string,
		readonly effectivePermissions: Permission[],
	) {}

	static create(user: User): AuthenticatedUserObject {
		if (user.deleted || user.hidden) throw new NotFoundException();

		return new AuthenticatedUserObject(
			user.id,
			user.deleted,
			user.hidden,
			user.name,
			'' /* TODO */,
			user.effectivePermissions,
		);
	}
}
