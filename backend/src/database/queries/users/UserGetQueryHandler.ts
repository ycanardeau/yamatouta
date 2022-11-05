import { UserDto } from '@/dto/UserDto';
import { User } from '@/entities/User';
import { UserGetParams } from '@/models/users/UserGetParams';
import { PermissionContext } from '@/services/PermissionContext';
import { whereNotDeleted, whereNotHidden } from '@/services/filters';
import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class UserGetQuery {
	constructor(
		readonly permissionContext: PermissionContext,
		readonly params: UserGetParams,
	) {}
}

@QueryHandler(UserGetQuery)
export class UserGetQueryHandler implements IQueryHandler<UserGetQuery> {
	constructor(
		@InjectRepository(User)
		private readonly userRepo: EntityRepository<User>,
	) {}

	async execute(query: UserGetQuery): Promise<UserDto> {
		const { permissionContext, params } = query;

		const user = await this.userRepo.findOne({
			id: params.id,
			$and: [
				whereNotDeleted(permissionContext),
				whereNotHidden(permissionContext),
			],
		});

		if (!user) throw new NotFoundException();

		return UserDto.create(permissionContext, user);
	}
}
