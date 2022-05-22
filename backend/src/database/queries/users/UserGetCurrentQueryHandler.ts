import { UnauthorizedException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { AuthenticatedUserObject } from '../../../dto/AuthenticatedUserObject';
import { PermissionContext } from '../../../services/PermissionContext';

export class UserGetCurrentQuery {
	constructor(readonly permissionContext: PermissionContext) {}
}

@QueryHandler(UserGetCurrentQuery)
export class UserGetCurrentQueryHandler
	implements IQueryHandler<UserGetCurrentQuery>
{
	constructor() {}

	async execute(
		query: UserGetCurrentQuery,
	): Promise<AuthenticatedUserObject> {
		if (!query.permissionContext.user) throw new UnauthorizedException();

		return query.permissionContext.user;
	}
}
