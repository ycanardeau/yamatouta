import { Controller, Get } from '@nestjs/common';
import { AjvParams, AjvQuery } from 'nestjs-ajv-glue/dist';

import { SearchResultObject } from '../dto/SearchResultObject';
import { UserObject } from '../dto/users/UserObject';
import {
	getUserParamsSchema,
	IGetUserParams,
} from '../requests/users/IGetUserParams';
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
		@AjvQuery(listUsersQuerySchema)
		query: IListUsersQuery,
	): Promise<SearchResultObject<UserObject>> {
		return this.listUsersService.listUsers(query);
	}

	@Get(':userId')
	getUser(
		@AjvParams(getUserParamsSchema)
		{ userId }: IGetUserParams,
	): Promise<UserObject> {
		return this.getUserService.getUser(userId);
	}
}
