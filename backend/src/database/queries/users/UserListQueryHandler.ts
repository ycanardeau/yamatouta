import { EntityManager, Knex } from '@mikro-orm/mariadb';
import { BadRequestException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import _ from 'lodash';

import { SearchResultObject } from '../../../dto/SearchResultObject';
import { UserObject } from '../../../dto/UserObject';
import { User } from '../../../entities/User';
import { UserListParams } from '../../../models/users/UserListParams';
import { UserSortRule } from '../../../models/users/UserSortRule';
import { NgramConverter } from '../../../services/NgramConverter';
import { PermissionContext } from '../../../services/PermissionContext';
import { orderByIds } from '../orderByIds';

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
		private readonly em: EntityManager,
		private readonly ngramConverter: NgramConverter,
	) {}

	private createKnex(params: UserListParams): Knex.QueryBuilder {
		const knex = this.em
			.createQueryBuilder(User)
			.getKnex()
			.andWhere('users.deleted', false)
			.andWhere('users.hidden', false);

		if (params.query) {
			knex.join(
				'user_search_index',
				'users.id',
				'user_search_index.user_id',
			).andWhereRaw(
				'MATCH(user_search_index.name) AGAINST(? IN BOOLEAN MODE)',
				this.ngramConverter.toQuery(params.query, 2),
			);
		}

		if (params.userGroup)
			knex.andWhere('users.user_group', params.userGroup);

		return knex;
	}

	private orderBy(
		knex: Knex.QueryBuilder,
		params: UserListParams,
	): Knex.QueryBuilder {
		switch (params.sort) {
			case UserSortRule.NameAsc:
				return knex
					.orderBy('users.name', 'asc')
					.orderBy('users.id', 'asc');

			case UserSortRule.NameDesc:
				return knex
					.orderBy('users.name', 'desc')
					.orderBy('users.id', 'desc');

			case UserSortRule.CreatedAsc:
			case undefined:
				return knex
					.orderBy('users.created_at', 'asc')
					.orderBy('users.id', 'asc');

			case UserSortRule.CreatedDesc:
				return knex
					.orderBy('users.created_at', 'desc')
					.orderBy('users.id', 'desc');
		}
	}

	private async getIds(params: UserListParams): Promise<number[]> {
		const knex = this.createKnex(params)
			.select('users.id')
			.limit(
				params.limit
					? Math.min(params.limit, UserListQueryHandler.maxLimit)
					: UserListQueryHandler.defaultLimit,
			);

		if (params.offset) knex.offset(params.offset);

		this.orderBy(knex, params);

		const ids = _.map(await this.em.execute(knex), 'id');

		return ids;
	}

	private async getItems(params: UserListParams): Promise<User[]> {
		const ids = await this.getIds(params);

		const knex = this.em
			.createQueryBuilder(User)
			.getKnex()
			.whereIn('id', ids);

		orderByIds(knex, ids);

		const results = await this.em.execute(knex);

		return results.map((result) => this.em.map(User, result));
	}

	private async getCount(params: UserListParams): Promise<number> {
		const knex = this.createKnex(params).countDistinct('users.id as count');

		const count = _.map(await this.em.execute(knex), 'count')[0];

		return count;
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

		const [users, count] = await Promise.all([
			params.offset && params.offset > UserListQueryHandler.maxOffset
				? Promise.resolve([])
				: this.getItems(params),
			params.getTotalCount ? this.getCount(params) : Promise.resolve(0),
		]);

		return SearchResultObject.create<UserObject>(
			users.map((user) => UserObject.create(user, permissionContext)),
			count,
		);
	}
}
