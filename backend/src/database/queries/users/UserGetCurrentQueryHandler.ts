import { AuthenticatedUserDto } from '@/dto/AuthenticatedUserDto';
import { PermissionContext } from '@/services/PermissionContext';
import { UnauthorizedException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class UserGetCurrentQuery {
	constructor(readonly permissionContext: PermissionContext) {}
}

@QueryHandler(UserGetCurrentQuery)
export class UserGetCurrentQueryHandler
	implements IQueryHandler<UserGetCurrentQuery>
{
	constructor() {}

	async execute(query: UserGetCurrentQuery): Promise<AuthenticatedUserDto> {
		if (!query.permissionContext.user) throw new UnauthorizedException();

		return query.permissionContext.user;
	}
}
