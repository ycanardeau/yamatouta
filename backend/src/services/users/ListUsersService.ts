import {
	EntityRepository,
	FilterQuery,
	FindOptions,
	QueryOrder,
	QueryOrderMap,
} from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';

import { SearchResultObject } from '../../dto/SearchResultObject';
import { UserObject } from '../../dto/users/UserObject';
import { User } from '../../entities/User';
import { UserSortRule } from '../../models/UserSortRule';
import { PermissionContext } from '../PermissionContext';
import { whereNotDeleted, whereNotHidden } from '../filters';

@Injectable()
export class ListUsersService {
	private static readonly defaultLimit = 10;
	private static readonly maxLimit = 100;
	private static readonly maxOffset = 5000;

	constructor(
		@InjectRepository(User)
		private readonly userRepo: EntityRepository<User>,
		private readonly permissionContext: PermissionContext,
	) {}

	private orderBy(sort?: UserSortRule): QueryOrderMap<{ id: QueryOrder }> {
		switch (sort) {
			default:
				return { id: QueryOrder.ASC };
		}
	}

	async listUsers(params: {
		sort?: UserSortRule;
		offset?: number;
		limit?: number;
		getTotalCount?: boolean;
	}): Promise<SearchResultObject<UserObject>> {
		const { sort, offset, limit, getTotalCount } = params;

		const where: FilterQuery<User> = {
			$and: [
				whereNotDeleted(this.permissionContext),
				whereNotHidden(this.permissionContext),
			],
		};

		const options: FindOptions<User> = {
			limit: limit
				? Math.min(limit, ListUsersService.maxLimit)
				: ListUsersService.defaultLimit,
			offset: offset,
		};

		const [users, count] = await Promise.all([
			offset && offset > ListUsersService.maxOffset
				? Promise.resolve([])
				: this.userRepo.find(where, {
						...options,
						orderBy: this.orderBy(sort),
				  }),
			getTotalCount
				? this.userRepo.count(where, options)
				: Promise.resolve(0),
		]);

		return new SearchResultObject<UserObject>(
			users.map((user) => new UserObject(user, this.permissionContext)),
			count,
		);
	}
}
