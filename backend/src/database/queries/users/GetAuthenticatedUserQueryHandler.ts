import { UnauthorizedException } from '@nestjs/common';

import { AuthenticatedUserObject } from '../../../dto/users/AuthenticatedUserObject';
import { PermissionContext } from '../../../services/PermissionContext';
import { IQueryHandler, QueryHandler } from '../IQueryHandler';

export class GetAuthenticatedUserQuery {}

@QueryHandler(GetAuthenticatedUserQuery)
export class GetAuthenticatedUserQueryHandler
	implements IQueryHandler<GetAuthenticatedUserQuery>
{
	constructor(private readonly permissionContext: PermissionContext) {}

	async execute(): Promise<AuthenticatedUserObject> {
		if (!this.permissionContext.user) throw new UnauthorizedException();

		return this.permissionContext.user;
	}
}
