import {
	EntityRepository,
	FilterQuery,
	FindOptions,
	QueryOrder,
	QueryOrderMap,
} from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import Joi from 'joi';

import { SearchResultObject } from '../../../dto/SearchResultObject';
import { UserObject } from '../../../dto/UserObject';
import { User } from '../../../entities/User';
import { UserSortRule } from '../../../models/UserSortRule';
import { PermissionContext } from '../../../services/PermissionContext';
import { whereNotDeleted, whereNotHidden } from '../../../services/filters';

export class UserListParams {
	constructor(
		readonly sort?: UserSortRule,
		readonly offset?: number,
		readonly limit?: number,
		readonly getTotalCount?: boolean,
	) {}

	static readonly schema = Joi.object<UserListParams>({
		offset: Joi.number().optional(),
		limit: Joi.number().optional(),
		getTotalCount: Joi.boolean().optional(),
	});
}

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

		return new SearchResultObject<UserObject>(
			users.map((user) => new UserObject(user, permissionContext)),
			count,
		);
	}
}
