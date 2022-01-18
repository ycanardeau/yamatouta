import {
	Controller,
	Get,
	Param,
	ParseIntPipe,
	Query,
	Req,
	UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

import { SearchResultObject } from '../dto/SearchResultObject';
import { AuthenticatedUserObject } from '../dto/users/AuthenticatedUserObject';
import { UserObject } from '../dto/users/UserObject';
import { JoiValidationPipe } from '../pipes/JoiValidationPipe';
import {
	IListUsersQuery,
	listUsersQuerySchema,
} from '../requests/users/IListUsersQuery';
import { GetUserService } from '../services/users/GetUserService';
import { ListUsersService } from '../services/users/ListUsersService';

@Controller('users')
export class UserController {
	constructor(
		private readonly listUsersService: ListUsersService,
		private readonly getUserService: GetUserService,
	) {}

	@Get()
	listUsers(
		@Query(new JoiValidationPipe(listUsersQuerySchema))
		query: IListUsersQuery,
	): Promise<SearchResultObject<UserObject>> {
		return this.listUsersService.listUsers(query);
	}

	@Get('current')
	getAuthenticatedUser(@Req() request: Request): AuthenticatedUserObject {
		if (!request.user) throw new UnauthorizedException();

		if (!(request.user instanceof AuthenticatedUserObject))
			throw new Error('user must be of type AuthenticatedUserObject.');

		return request.user;
	}

	@Get(':userId')
	getUser(
		@Param('userId', ParseIntPipe) userId: number,
	): Promise<UserObject> {
		return this.getUserService.getUser(userId);
	}
}
