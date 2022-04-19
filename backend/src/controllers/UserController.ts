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

import { UpdateAuthenticatedUserCommand } from '../database/commands/users/UpdateAuthenticatedUserCommandHandler';
import { GetAuthenticatedUserQuery } from '../database/queries/users/GetAuthenticatedUserQueryHandler';
import { GetUserQuery } from '../database/queries/users/GetUserQueryHandler';
import { ListUsersQuery } from '../database/queries/users/ListUsersQueryHandler';
import { GetPermissionContext } from '../decorators/GetPermissionContext';
import { SearchResultObject } from '../dto/SearchResultObject';
import { AuthenticatedUserObject } from '../dto/users/AuthenticatedUserObject';
import { UserObject } from '../dto/users/UserObject';
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
		@Query(new JoiValidationPipe(ListUsersQuery.schema))
		query: ListUsersQuery,
	): Promise<SearchResultObject<UserObject>> {
		return this.queryBus.execute(
			new ListUsersQuery(
				permissionContext,
				query.sort,
				query.offset,
				query.limit,
				query.getTotalCount,
			),
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
		@Body(new JoiValidationPipe(UpdateAuthenticatedUserCommand.schema))
		command: UpdateAuthenticatedUserCommand,
	): Promise<AuthenticatedUserObject> {
		return this.commandBus.execute(
			new UpdateAuthenticatedUserCommand(
				permissionContext,
				command.password,
				command.username,
				command.email,
				command.newPassword,
			),
		);
	}

	@Get(':userId')
	getUser(
		@GetPermissionContext() permissionContext: PermissionContext,
		@Param('userId', ParseIntPipe) userId: number,
	): Promise<UserObject> {
		return this.queryBus.execute(
			new GetUserQuery(permissionContext, userId),
		);
	}
}
