import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { UserCreateCommand } from '../database/commands/users/UserCreateCommandHandler';
import { UserUpdateCommand } from '../database/commands/users/UserUpdateCommandHandler';
import { UserGetCurrentQuery } from '../database/queries/users/UserGetCurrentQueryHandler';
import { UserGetQuery } from '../database/queries/users/UserGetQueryHandler';
import { UserListQuery } from '../database/queries/users/UserListQueryHandler';
import { GetPermissionContext } from '../decorators/GetPermissionContext';
import { AuthenticatedUserObject } from '../dto/AuthenticatedUserObject';
import { SearchResultObject } from '../dto/SearchResultObject';
import { UserObject } from '../dto/UserObject';
import { UserCreateParams } from '../models/users/UserCreateParams';
import { UserGetParams } from '../models/users/UserGetParams';
import { UserListParams } from '../models/users/UserListParams';
import { UserUpdateParams } from '../models/users/UserUpdateParams';
import { JoiValidationPipe } from '../pipes/JoiValidationPipe';
import { PermissionContext } from '../services/PermissionContext';

@Controller('users')
export class UserController {
	constructor(
		private readonly queryBus: QueryBus,
		private readonly commandBus: CommandBus,
	) {}

	@Post('create')
	create(
		@GetPermissionContext() permissionContext: PermissionContext,
		@Body(new JoiValidationPipe(UserCreateParams.schema))
		params: UserCreateParams,
	): Promise<AuthenticatedUserObject> {
		return this.commandBus.execute(
			new UserCreateCommand(permissionContext, params),
		);
	}

	@Get('get')
	get(
		@GetPermissionContext() permissionContext: PermissionContext,
		@Query(new JoiValidationPipe(UserGetParams.schema))
		params: UserGetParams,
	): Promise<UserObject> {
		return this.queryBus.execute(
			new UserGetQuery(permissionContext, params),
		);
	}

	@Get('get-current')
	getCurrent(
		@GetPermissionContext() permissionContext: PermissionContext,
	): Promise<AuthenticatedUserObject> {
		return this.queryBus.execute(
			new UserGetCurrentQuery(permissionContext),
		);
	}

	@Get('list')
	list(
		@GetPermissionContext() permissionContext: PermissionContext,
		@Query(new JoiValidationPipe(UserListParams.schema))
		params: UserListParams,
	): Promise<SearchResultObject<UserObject>> {
		return this.queryBus.execute(
			new UserListQuery(permissionContext, params),
		);
	}

	@Post('update')
	update(
		@GetPermissionContext() permissionContext: PermissionContext,
		@Body(new JoiValidationPipe(UserUpdateParams.schema))
		params: UserUpdateParams,
	): Promise<AuthenticatedUserObject> {
		return this.commandBus.execute(
			new UserUpdateCommand(permissionContext, params),
		);
	}
}
