import {
	Body,
	Controller,
	Get,
	Param,
	ParseIntPipe,
	Patch,
	Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import {
	UpdateAuthenticatedUserCommand,
	UpdateAuthenticatedUserParams,
} from '../database/commands/users/UpdateAuthenticatedUserCommandHandler';
import { GetAuthenticatedUserQuery } from '../database/queries/users/GetAuthenticatedUserQueryHandler';
import { GetUserQuery } from '../database/queries/users/GetUserQueryHandler';
import {
	ListUsersParams,
	ListUsersQuery,
} from '../database/queries/users/ListUsersQueryHandler';
import { GetPermissionContext } from '../decorators/GetPermissionContext';
import { AuthenticatedUserObject } from '../dto/AuthenticatedUserObject';
import { SearchResultObject } from '../dto/SearchResultObject';
import { UserObject } from '../dto/UserObject';
import { JoiValidationPipe } from '../pipes/JoiValidationPipe';
import { PermissionContext } from '../services/PermissionContext';

@Controller('users')
export class UserController {
	constructor(
		private readonly queryBus: QueryBus,
		private readonly commandBus: CommandBus,
	) {}

	@Get()
	listUsers(
		@GetPermissionContext() permissionContext: PermissionContext,
		@Query(new JoiValidationPipe(ListUsersParams.schema))
		params: ListUsersParams,
	): Promise<SearchResultObject<UserObject>> {
		return this.queryBus.execute(
			new ListUsersQuery(permissionContext, params),
		);
	}

	@Get('current')
	getAuthenticatedUser(
		@GetPermissionContext() permissionContext: PermissionContext,
	): Promise<AuthenticatedUserObject> {
		return this.queryBus.execute(
			new GetAuthenticatedUserQuery(permissionContext),
		);
	}

	@Patch('current')
	updateAuthenticatedUser(
		@GetPermissionContext() permissionContext: PermissionContext,
		@Body(new JoiValidationPipe(UpdateAuthenticatedUserParams.schema))
		params: UpdateAuthenticatedUserParams,
	): Promise<AuthenticatedUserObject> {
		return this.commandBus.execute(
			new UpdateAuthenticatedUserCommand(permissionContext, params),
		);
	}

	@Get(':userId')
	getUser(
		@GetPermissionContext() permissionContext: PermissionContext,
		@Param('userId', ParseIntPipe) userId: number,
	): Promise<UserObject> {
		return this.queryBus.execute(
			new GetUserQuery(permissionContext, { userId }),
		);
	}
}
