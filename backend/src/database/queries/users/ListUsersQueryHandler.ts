import {
	EntityRepository,
	FilterQuery,
	FindOptions,
	QueryOrder,
	QueryOrderMap,
} from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import Joi, { ObjectSchema } from 'joi';

import { SearchResultObject } from '../../../dto/SearchResultObject';
import { UserObject } from '../../../dto/users/UserObject';
import { User } from '../../../entities/User';
import { UserSortRule } from '../../../models/UserSortRule';
import { PermissionContext } from '../../../services/PermissionContext';
import { whereNotDeleted, whereNotHidden } from '../../../services/filters';

export class ListUsersQuery {
	static readonly schema: ObjectSchema<ListUsersQuery> = Joi.object({
		offset: Joi.number().optional(),
		limit: Joi.number().optional(),
		getTotalCount: Joi.boolean().optional(),
	});

	constructor(
		readonly permissionContext: PermissionContext,
		readonly sort?: UserSortRule,
		readonly offset?: number,
		readonly limit?: number,
		readonly getTotalCount?: boolean,
	) {}
}

@QueryHandler(ListUsersQuery)
export class ListUsersQueryHandler implements IQueryHandler<ListUsersQuery> {
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
		query: ListUsersQuery,
	): Promise<SearchResultObject<UserObject>> {
		const where: FilterQuery<User> = {
			$and: [
				whereNotDeleted(query.permissionContext),
				whereNotHidden(query.permissionContext),
			],
		};

		const options: FindOptions<User> = {
			limit: query.limit
				? Math.min(query.limit, ListUsersQueryHandler.maxLimit)
				: ListUsersQueryHandler.defaultLimit,
			offset: query.offset,
		};

		const [users, count] = await Promise.all([
			query.offset && query.offset > ListUsersQueryHandler.maxOffset
				? Promise.resolve([])
				: this.userRepo.find(where, {
						...options,
						orderBy: this.orderBy(query.sort),
				  }),
			query.getTotalCount
				? this.userRepo.count(where, options)
				: Promise.resolve(0),
		]);

		return new SearchResultObject<UserObject>(
			users.map((user) => new UserObject(user, query.permissionContext)),
			count,
		);
	}
}
