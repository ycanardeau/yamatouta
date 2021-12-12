import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';

import { SearchResultObject } from '../dto/SearchResultObject';
import { UserObject } from '../dto/users/UserObject';
import { ListUsersQuery } from '../requests/users/ListUsersQuery';
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
		@Query() query: ListUsersQuery,
	): Promise<SearchResultObject<UserObject>> {
		return this.listUsersService.listUsers({
			// TODO: sort: UserSortRule[query.sort as keyof typeof UserSortRule],
			offset: Number(query.offset),
			limit: Number(query.limit),
			getTotalCount: query.getTotalCount === 'true',
		});
	}

	@Get(':userId')
	getUser(
		@Param('userId', ParseIntPipe) userId: number,
	): Promise<UserObject> {
		return this.getUserService.getUser(userId);
	}
}
