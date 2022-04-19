import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { UserObject } from '../../../dto/users/UserObject';
import { User } from '../../../entities/User';
import { PermissionContext } from '../../../services/PermissionContext';
import { whereNotDeleted, whereNotHidden } from '../../../services/filters';

export class GetUserQuery {
	constructor(
		readonly permissionContext: PermissionContext,
		readonly userId: number,
	) {}
}

@QueryHandler(GetUserQuery)
export class GetUserQueryHandler implements IQueryHandler<GetUserQuery> {
	constructor(
		@InjectRepository(User)
		private readonly userRepo: EntityRepository<User>,
	) {}

	async execute(query: GetUserQuery): Promise<UserObject> {
		const user = await this.userRepo.findOne({
			id: query.userId,
			$and: [
				whereNotDeleted(query.permissionContext),
				whereNotHidden(query.permissionContext),
			],
		});

		if (!user) throw new NotFoundException();

		return new UserObject(user, query.permissionContext);
	}
}
