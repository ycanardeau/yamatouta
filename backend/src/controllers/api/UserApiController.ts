import { UserCreateCommand } from '@/database/commands/users/UserCreateCommandHandler';
import { UserUpdateCommand } from '@/database/commands/users/UserUpdateCommandHandler';
import { UserGetCurrentQuery } from '@/database/queries/users/UserGetCurrentQueryHandler';
import { UserGetQuery } from '@/database/queries/users/UserGetQueryHandler';
import { UserListQuery } from '@/database/queries/users/UserListQueryHandler';
import { AuthenticatedUserDto } from '@/dto/AuthenticatedUserDto';
import { SearchResultDto } from '@/dto/SearchResultDto';
import { UserDto } from '@/dto/UserDto';
import { GetPermissionContext } from '@/framework/decorators/GetPermissionContext';
import { JoiValidationPipe } from '@/framework/pipes/JoiValidationPipe';
import { UserCreateParams } from '@/models/users/UserCreateParams';
import { UserGetParams } from '@/models/users/UserGetParams';
import { UserListParams } from '@/models/users/UserListParams';
import { UserUpdateParams } from '@/models/users/UserUpdateParams';
import { PermissionContext } from '@/services/PermissionContext';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

@Controller('api/users')
export class UserApiController {
	constructor(
		private readonly queryBus: QueryBus,
		private readonly commandBus: CommandBus,
	) {}

	@Post('create')
	create(
		@GetPermissionContext() permissionContext: PermissionContext,
		@Body(new JoiValidationPipe(UserCreateParams.schema))
		params: UserCreateParams,
	): Promise<AuthenticatedUserDto> {
		return this.commandBus.execute(
			new UserCreateCommand(permissionContext, params),
		);
	}

	@Get('get')
	get(
		@GetPermissionContext() permissionContext: PermissionContext,
		@Query(new JoiValidationPipe(UserGetParams.schema))
		params: UserGetParams,
	): Promise<UserDto> {
		return this.queryBus.execute(
			new UserGetQuery(permissionContext, params),
		);
	}

	@Get('get-current')
	getCurrent(
		@GetPermissionContext() permissionContext: PermissionContext,
	): Promise<AuthenticatedUserDto> {
		return this.queryBus.execute(
			new UserGetCurrentQuery(permissionContext),
		);
	}

	@Get('list')
	list(
		@GetPermissionContext() permissionContext: PermissionContext,
		@Query(new JoiValidationPipe(UserListParams.schema))
		params: UserListParams,
	): Promise<SearchResultDto<UserDto>> {
		return this.queryBus.execute(
			new UserListQuery(permissionContext, params),
		);
	}

	@Post('update')
	update(
		@GetPermissionContext() permissionContext: PermissionContext,
		@Body(new JoiValidationPipe(UserUpdateParams.schema))
		params: UserUpdateParams,
	): Promise<AuthenticatedUserDto> {
		return this.commandBus.execute(
			new UserUpdateCommand(permissionContext, params),
		);
	}
}
