import {
	Body,
	Controller,
	Get,
	Param,
	ParseIntPipe,
	Patch,
	Query,
	Req,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Request } from 'express';

import { UpdateAuthenticatedUserCommand } from '../database/commands/users/UpdateAuthenticatedUserCommandHandler';
import { GetAuthenticatedUserQuery } from '../database/queries/users/GetAuthenticatedUserQueryHandler';
import { GetUserQuery } from '../database/queries/users/GetUserQueryHandler';
import { ListUsersQuery } from '../database/queries/users/ListUsersQueryHandler';
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
		@Req() request: Request,
		@Query(new JoiValidationPipe(ListUsersQuery.schema))
		query: ListUsersQuery,
	): Promise<SearchResultObject<UserObject>> {
		return this.queryBus.execute(
			new ListUsersQuery(
				new PermissionContext(request),
				query.sort,
				query.offset,
				query.limit,
				query.getTotalCount,
			),
		);
	}

	@Get('current')
	getAuthenticatedUser(
		@Req() request: Request,
	): Promise<AuthenticatedUserObject> {
		return this.queryBus.execute(
			new GetAuthenticatedUserQuery(new PermissionContext(request)),
		);
	}

	@Patch('current')
	updateAuthenticatedUser(
		@Req() request: Request,
		@Body(new JoiValidationPipe(UpdateAuthenticatedUserCommand.schema))
		command: UpdateAuthenticatedUserCommand,
	): Promise<AuthenticatedUserObject> {
		return this.commandBus.execute(
			new UpdateAuthenticatedUserCommand(
				new PermissionContext(request),
				command.password,
				command.username,
				command.email,
				command.newPassword,
			),
		);
	}

	@Get(':userId')
	getUser(
		@Req() request: Request,
		@Param('userId', ParseIntPipe) userId: number,
	): Promise<UserObject> {
		return this.queryBus.execute(
			new GetUserQuery(new PermissionContext(request), userId),
		);
	}
}
