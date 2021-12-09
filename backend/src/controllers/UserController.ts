import { Controller, Get } from '@nestjs/common';
import { AjvQuery } from 'nestjs-ajv-glue/dist';

import { SearchResultObject } from '../dto/SearchResultObject';
import { UserObject } from '../dto/users/UserObject';
import {
	IListUsersQuery,
	listUsersQuerySchema,
} from '../requests/users/IListUsersQuery';
import { ListUsersService } from '../services/users/ListUsersService';

@Controller('users')
export class UserController {
	constructor(private readonly listUsersService: ListUsersService) {}

	@Get()
	listUsers(
		@AjvQuery(listUsersQuerySchema)
		query: IListUsersQuery,
	): Promise<SearchResultObject<UserObject>> {
		return this.listUsersService.listUsers(query);
	}
}
