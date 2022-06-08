import {
	EntityRepository,
	FilterQuery,
	FindOptions,
	QueryOrder,
	QueryOrderMap,
} from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { SearchResultObject } from '../../../dto/SearchResultObject';
import { UserObject } from '../../../dto/UserObject';
import { User } from '../../../entities/User';
import { UserSortRule } from '../../../models/UserSortRule';
import { UserListParams } from '../../../models/users/UserListParams';
import { PermissionContext } from '../../../services/PermissionContext';
import { whereNotDeleted, whereNotHidden } from '../../../services/filters';

export class UserListQuery {
	constructor(
		readonly permissionContext: PermissionContext,
		readonly params: UserListParams,
	) {}
}

@QueryHandler(UserListQuery)
export class UserListQueryHandler implements IQueryHandler<UserListQuery> {
	private static readonly defaultLimit = 10;
	private static readonly maxLimit = 100;
	private static readonly maxOffset = 5000;

	constructor(
		@InjectRepository(User)
		private readonly userRepo: EntityRepository<User>,
	) {}

	private orderBy(sort?: UserSortRule): QueryOrderMap<{ id: QueryOrder }> {
		switch (sort) {
			default:
				return { id: QueryOrder.ASC };
		}
	}

	async execute(
		query: UserListQuery,
	): Promise<SearchResultObject<UserObject>> {
		const { permissionContext, params } = query;

		const result = UserListParams.schema.validate(params, {
			convert: true,
		});

		if (result.error)
			throw new BadRequestException(result.error.details[0].message);

		const where: FilterQuery<User> = {
			$and: [
				whereNotDeleted(permissionContext),
				whereNotHidden(permissionContext),
			],
		};

		const options: FindOptions<User> = {
			limit: params.limit
				? Math.min(params.limit, UserListQueryHandler.maxLimit)
				: UserListQueryHandler.defaultLimit,
			offset: params.offset,
		};

		const [users, count] = await Promise.all([
			params.offset && params.offset > UserListQueryHandler.maxOffset
				? Promise.resolve([])
				: this.userRepo.find(where, {
						...options,
						orderBy: this.orderBy(params.sort),
				  }),
			params.getTotalCount
				? this.userRepo.count(where, options)
				: Promise.resolve(0),
		]);

		return SearchResultObject.create<UserObject>(
			users.map((user) => UserObject.create(user, permissionContext)),
			count,
		);
	}
}
