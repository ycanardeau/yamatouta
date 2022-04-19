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
import { SearchResultObject } from '../dto/SearchResultObject';
import { AuthenticatedUserObject } from '../dto/users/AuthenticatedUserObject';
import { UserObject } from '../dto/users/UserObject';
import { JoiValidationPipe } from '../pipes/JoiValidationPipe';

@Controller('users')
export class UserController {
	constructor(
		private readonly queryBus: QueryBus,
		private readonly commandBus: CommandBus,
	) {}

	@Get()
	listUsers(
		@Query(new JoiValidationPipe(ListUsersQuery.schema))
		query: ListUsersQuery,
	): Promise<SearchResultObject<UserObject>> {
		return this.queryBus.execute(
			new ListUsersQuery(
				query.sort,
				query.offset,
				query.limit,
				query.getTotalCount,
			),
		);
	}

	@Get('current')
	getAuthenticatedUser(): Promise<AuthenticatedUserObject> {
		return this.queryBus.execute(new GetAuthenticatedUserQuery());
	}

	@Patch('current')
	updateAuthenticatedUser(
		@Body(new JoiValidationPipe(UpdateAuthenticatedUserCommand.schema))
		command: UpdateAuthenticatedUserCommand,
	): Promise<AuthenticatedUserObject> {
		return this.commandBus.execute(
			new UpdateAuthenticatedUserCommand(
				command.password,
				command.username,
				command.email,
				command.newPassword,
			),
		);
	}

	@Get(':userId')
	getUser(
		@Param('userId', ParseIntPipe) userId: number,
	): Promise<UserObject> {
		return this.queryBus.execute(new GetUserQuery(userId));
	}
}
