import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, NotFoundException } from '@nestjs/common';

import { UserObject } from '../../../dto/users/UserObject';
import { User } from '../../../entities/User';
import { PermissionContext } from '../../../services/PermissionContext';
import { whereNotDeleted, whereNotHidden } from '../../../services/filters';

export class GetUserQuery {
	constructor(readonly userId: number) {}
}

@Injectable()
export class GetUserQueryHandler {
	constructor(
		@InjectRepository(User)
		private readonly userRepo: EntityRepository<User>,
		private readonly permissionContext: PermissionContext,
	) {}

	async execute(query: GetUserQuery): Promise<UserObject> {
		const user = await this.userRepo.findOne({
			id: query.userId,
			$and: [
				whereNotDeleted(this.permissionContext),
				whereNotHidden(this.permissionContext),
			],
		});

		if (!user) throw new NotFoundException();

		return new UserObject(user, this.permissionContext);
	}
}
