import {
	Body,
	Controller,
	Get,
	Param,
	ParseIntPipe,
	Patch,
	Query,
} from '@nestjs/common';

import {
	UpdateAuthenticatedUserCommand,
	UpdateAuthenticatedUserCommandHandler,
} from '../database/commands/users/UpdateAuthenticatedUserCommandHandler';
import { GetAuthenticatedUserQueryHandler } from '../database/queries/users/GetAuthenticatedUserQueryHandler';
import { GetUserQueryHandler } from '../database/queries/users/GetUserQueryHandler';
import {
	ListUsersQuery,
	ListUsersQueryHandler,
} from '../database/queries/users/ListUsersQueryHandler';
import { SearchResultObject } from '../dto/SearchResultObject';
import { AuthenticatedUserObject } from '../dto/users/AuthenticatedUserObject';
import { UserObject } from '../dto/users/UserObject';
import { JoiValidationPipe } from '../pipes/JoiValidationPipe';

@Controller('users')
export class UserController {
	constructor(
		private readonly listUsersQueryHandler: ListUsersQueryHandler,
		private readonly getUserQueryHandler: GetUserQueryHandler,
		private readonly getAuthenticatedUserQueryHandler: GetAuthenticatedUserQueryHandler,
		private readonly updateAuthenticatedUserCommandHandler: UpdateAuthenticatedUserCommandHandler,
	) {}

	@Get()
	listUsers(
		@Query(new JoiValidationPipe(ListUsersQuery.schema))
		query: ListUsersQuery,
	): Promise<SearchResultObject<UserObject>> {
		return this.listUsersQueryHandler.execute(query);
	}

	@Get('current')
	getAuthenticatedUser(): AuthenticatedUserObject {
		return this.getAuthenticatedUserQueryHandler.execute();
	}

	@Patch('current')
	updateAuthenticatedUser(
		@Body(new JoiValidationPipe(UpdateAuthenticatedUserCommand.schema))
		command: UpdateAuthenticatedUserCommand,
	): Promise<AuthenticatedUserObject> {
		return this.updateAuthenticatedUserCommandHandler.execute(command);
	}

	@Get(':userId')
	getUser(
		@Param('userId', ParseIntPipe) userId: number,
	): Promise<UserObject> {
		return this.getUserQueryHandler.execute({ userId: userId });
	}
}
