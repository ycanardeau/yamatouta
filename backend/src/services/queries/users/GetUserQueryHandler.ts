import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, NotFoundException } from '@nestjs/common';

import { UserObject } from '../../../dto/users/UserObject';
import { User } from '../../../entities/User';
import { PermissionContext } from '../../PermissionContext';
import { whereNotDeleted, whereNotHidden } from '../../filters';

@Injectable()
export class GetUserQueryHandler {
	constructor(
		@InjectRepository(User)
		private readonly userRepo: EntityRepository<User>,
		private readonly permissionContext: PermissionContext,
	) {}

	async execute(userId: number): Promise<UserObject> {
		const user = await this.userRepo.findOne({
			id: userId,
			$and: [
				whereNotDeleted(this.permissionContext),
				whereNotHidden(this.permissionContext),
			],
		});

		if (!user) throw new NotFoundException();

		return new UserObject(user, this.permissionContext);
	}
}
