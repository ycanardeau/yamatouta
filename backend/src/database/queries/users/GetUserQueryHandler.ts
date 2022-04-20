import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { UserObject } from '../../../dto/users/UserObject';
import { User } from '../../../entities/User';
import { PermissionContext } from '../../../services/PermissionContext';
import { whereNotDeleted, whereNotHidden } from '../../../services/filters';

export class GetUserParams {
	constructor(readonly userId: number) {}
}

export class GetUserQuery {
	constructor(
		readonly permissionContext: PermissionContext,
		readonly params: GetUserParams,
	) {}
}

@QueryHandler(GetUserQuery)
export class GetUserQueryHandler implements IQueryHandler<GetUserQuery> {
	constructor(
		@InjectRepository(User)
		private readonly userRepo: EntityRepository<User>,
	) {}

	async execute(query: GetUserQuery): Promise<UserObject> {
		const { permissionContext, params } = query;

		const user = await this.userRepo.findOne({
			id: params.userId,
			$and: [
				whereNotDeleted(permissionContext),
				whereNotHidden(permissionContext),
			],
		});

		if (!user) throw new NotFoundException();

		return new UserObject(user, permissionContext);
	}
}
