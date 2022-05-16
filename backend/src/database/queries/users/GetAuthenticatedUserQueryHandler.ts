import { UnauthorizedException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { AuthenticatedUserObject } from '../../../dto/AuthenticatedUserObject';
import { PermissionContext } from '../../../services/PermissionContext';

export class GetAuthenticatedUserQuery {
	constructor(readonly permissionContext: PermissionContext) {}
}

@QueryHandler(GetAuthenticatedUserQuery)
export class GetAuthenticatedUserQueryHandler
	implements IQueryHandler<GetAuthenticatedUserQuery>
{
	constructor() {}

	async execute(
		query: GetAuthenticatedUserQuery,
	): Promise<AuthenticatedUserObject> {
		if (!query.permissionContext.user) throw new UnauthorizedException();

		return query.permissionContext.user;
	}
}
