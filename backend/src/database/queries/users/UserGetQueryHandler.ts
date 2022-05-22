import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import Joi from 'joi';

import { UserObject } from '../../../dto/UserObject';
import { User } from '../../../entities/User';
import { PermissionContext } from '../../../services/PermissionContext';
import { whereNotDeleted, whereNotHidden } from '../../../services/filters';

export class UserGetParams {
	static readonly schema = Joi.object<UserGetParams>({
		id: Joi.number().required(),
	});

	constructor(readonly id: number) {}
}

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

	async execute(query: UserGetQuery): Promise<UserObject> {
		const { permissionContext, params } = query;

		const user = await this.userRepo.findOne({
			id: params.id,
			$and: [
				whereNotDeleted(permissionContext),
				whereNotHidden(permissionContext),
			],
		});

		if (!user) throw new NotFoundException();

		return new UserObject(user, permissionContext);
	}
}
