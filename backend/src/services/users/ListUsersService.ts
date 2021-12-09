import { QueryOrder, QueryOrderMap } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

import { SearchResultObject } from '../../dto/SearchResultObject';
import { UserObject } from '../../dto/users/UserObject';
import { UserSortRule } from '../../dto/users/UserSortRule';
import { User } from '../../entities/User';

@Injectable()
export class ListUsersService {
	private static readonly defaultLimit = 10;
	private static readonly maxLimit = 100;

	constructor(private readonly em: EntityManager) {}

	private orderBy(sort?: UserSortRule): QueryOrderMap {
		switch (sort) {
			default:
				return { id: QueryOrder.ASC };
		}
	}

	listUsers(params: {
		sort?: UserSortRule;
		offset?: number;
		limit?: number;
		getTotalCount?: boolean;
	}): Promise<SearchResultObject<UserObject>> {
		const { sort, offset, limit, getTotalCount } = params;

		return this.em.transactional(async (em) => {
			const qb = em
				.createQueryBuilder(User)
				.andWhere({ deleted: false, hidden: false });

			const getItems = async (): Promise<User[]> => {
				const idsQB = qb
					.clone()
					.select('id')
					.limit(
						limit
							? Math.min(limit, ListUsersService.maxLimit)
							: ListUsersService.defaultLimit,
						offset,
					);

				const orderBy = this.orderBy(sort);
				idsQB.orderBy(orderBy);

				const ids = (await idsQB.execute<{ id: number }[]>()).map(
					(x) => x.id,
				);

				return em.find(
					User,
					{ id: { $in: ids } },
					{ orderBy: orderBy },
				);
			};

			const getCount = async (): Promise<number> => {
				if (!getTotalCount) return 0;

				return (
					await qb.clone().count().execute<{ count: number }[]>()
				)[0].count;
			};

			const [users, count] = await Promise.all([getItems(), getCount()]);

			return new SearchResultObject<UserObject>(
				users.map((user) => new UserObject(user)),
				count,
			);
		});
	}
}
