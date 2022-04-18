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
import { GetAuthenticatedUserService } from '../services/users/GetAuthenticatedUserService';
import { GetUserService } from '../services/users/GetUserService';
import { ListUsersService } from '../services/users/ListUsersService';
import { UpdateAuthenticatedUserService } from '../services/users/UpdateAuthenticatedUserService';

@Controller('users')
export class UserController {
	constructor(
		private readonly listUsersService: ListUsersService,
		private readonly getUserService: GetUserService,
		private readonly getAuthenticatedUserService: GetAuthenticatedUserService,
		private readonly updateAuthenticatedUserService: UpdateAuthenticatedUserService,
	) {}

	@Get()
	listUsers(
		@Query(new JoiValidationPipe(listUsersQuerySchema))
		query: IListUsersQuery,
	): Promise<SearchResultObject<UserObject>> {
		return this.listUsersService.execute(query);
	}

	@Get('current')
	getAuthenticatedUser(): AuthenticatedUserObject {
		return this.getAuthenticatedUserService.execute();
	}

	@Patch('current')
	updateAuthenticatedUser(
		@Body(new JoiValidationPipe(updateAuthenticatedUserBodySchema))
		body: IUpdateAuthenticatedUserBody,
	): Promise<AuthenticatedUserObject> {
		return this.updateAuthenticatedUserService.execute(body);
	}

	@Get(':userId')
	getUser(
		@Param('userId', ParseIntPipe) userId: number,
	): Promise<UserObject> {
		return this.getUserService.execute(userId);
	}
}
