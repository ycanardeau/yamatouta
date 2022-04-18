import {
	Body,
	Controller,
	Get,
	Param,
	ParseIntPipe,
	Patch,
	Query,
} from '@nestjs/common';

import { SearchResultObject } from '../dto/SearchResultObject';
import { AuthenticatedUserObject } from '../dto/users/AuthenticatedUserObject';
import { UserObject } from '../dto/users/UserObject';
import { JoiValidationPipe } from '../pipes/JoiValidationPipe';
import {
	IListUsersQuery,
	listUsersQuerySchema,
} from '../requests/users/IListUsersQuery';
import {
	IUpdateAuthenticatedUserBody,
	updateAuthenticatedUserBodySchema,
} from '../requests/users/IUpdateAuthenticatedUserBody';
import { UpdateAuthenticatedUserCommandHandler } from '../services/commands/users/UpdateAuthenticatedUserCommandHandler';
import { GetAuthenticatedUserQueryHandler } from '../services/queries/users/GetAuthenticatedUserQueryHandler';
import { GetUserQueryHandler } from '../services/queries/users/GetUserQueryHandler';
import { ListUsersQueryHandler } from '../services/queries/users/ListUsersQueryHandler';

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
		@Query(new JoiValidationPipe(listUsersQuerySchema))
		query: IListUsersQuery,
	): Promise<SearchResultObject<UserObject>> {
		return this.listUsersQueryHandler.execute(query);
	}

	@Get('current')
	getAuthenticatedUser(): AuthenticatedUserObject {
		return this.getAuthenticatedUserQueryHandler.execute();
	}

	@Patch('current')
	updateAuthenticatedUser(
		@Body(new JoiValidationPipe(updateAuthenticatedUserBodySchema))
		body: IUpdateAuthenticatedUserBody,
	): Promise<AuthenticatedUserObject> {
		return this.updateAuthenticatedUserCommandHandler.execute(body);
	}

	@Get(':userId')
	getUser(
		@Param('userId', ParseIntPipe) userId: number,
	): Promise<UserObject> {
		return this.getUserQueryHandler.execute(userId);
	}
}
