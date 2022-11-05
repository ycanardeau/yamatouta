import { orderByIds } from '@/database/queries/orderByIds';
import { HashtagObject } from '@/dto/HashtagObject';
import { SearchResultObject } from '@/dto/SearchResultObject';
import { Hashtag } from '@/entities/Hashtag';
import { HashtagListParams } from '@/models/hashtags/HashtagListParams';
import { HashtagSortRule } from '@/models/hashtags/HashtagSortRule';
import { PermissionContext } from '@/services/PermissionContext';
import { EntityManager, Knex } from '@mikro-orm/mariadb';
import { BadRequestException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import _ from 'lodash';

export class HashtagListQuery {
	constructor(
		readonly permissionContext: PermissionContext,
		readonly params: HashtagListParams,
	) {}
}

@QueryHandler(HashtagListQuery)
export class HashtagListQueryHandler
	implements IQueryHandler<HashtagListQuery>
{
	private static readonly defaultLimit = 10;
	private static readonly maxLimit = 100;
	private static readonly maxOffset = 5000;

	constructor(private readonly em: EntityManager) {}

	private createKnex(params: HashtagListParams): Knex.QueryBuilder {
		const knex = this.em
			.createQueryBuilder(Hashtag)
			.getKnex()
			.andWhere('hashtags.deleted', false)
			.andWhere('hashtags.hidden', false)
			.andWhere('hashtags.reference_count', '>', 0);

		if (params.query) {
			// TODO
		}

		return knex;
	}

	private orderBy(
		knex: Knex.QueryBuilder,
		params: HashtagListParams,
	): Knex.QueryBuilder {
		switch (params.sort) {
			case HashtagSortRule.NameAsc:
				return knex
					.orderBy('hashtags.name', 'asc')
					.orderBy('hashtags.id', 'asc');

			case HashtagSortRule.NameDesc:
				return knex
					.orderBy('hashtags.name', 'desc')
					.orderBy('hashtags.id', 'desc');

			case HashtagSortRule.ReferenceCountAsc:
				return knex
					.orderBy('hashtags.reference_count', 'asc')
					.orderBy('hashtags.name', 'asc')
					.orderBy('hashtags.id', 'asc');

			case HashtagSortRule.ReferenceCountDesc:
			case undefined:
				return knex
					.orderBy('hashtags.reference_count', 'desc')
					.orderBy('hashtags.name', 'asc')
					.orderBy('hashtags.id', 'desc');
		}
	}

	private async getIds(params: HashtagListParams): Promise<number[]> {
		const knex = this.createKnex(params)
			.select('hashtags.id')
			.limit(
				params.limit
					? Math.min(params.limit, HashtagListQueryHandler.maxLimit)
					: HashtagListQueryHandler.defaultLimit,
			);

		if (params.offset) knex.offset(params.offset);

		this.orderBy(knex, params);

		const ids = _.map(await this.em.execute(knex), 'id');

		return ids;
	}

	private async getItems(params: HashtagListParams): Promise<Hashtag[]> {
		if (params.offset && params.offset > HashtagListQueryHandler.maxOffset)
			return [];

		const ids = await this.getIds(params);

		const knex = this.em
			.createQueryBuilder(Hashtag)
			.getKnex()
			.whereIn('id', ids);

		orderByIds(knex, ids);

		const results = await this.em.execute(knex);

		return results.map((result) => this.em.map(Hashtag, result));
	}

	private async getCount(params: HashtagListParams): Promise<number> {
		if (!params.getTotalCount) return 0;

		const knex = this.createKnex(params).countDistinct(
			'hashtags.id as count',
		);

		const count = _.map(await this.em.execute(knex), 'count')[0];

		return count;
	}

	async execute(
		query: HashtagListQuery,
	): Promise<SearchResultObject<HashtagObject>> {
		const { permissionContext, params } = query;

		const result = HashtagListParams.schema.validate(params, {
			convert: true,
		});

		if (result.error)
			throw new BadRequestException(result.error.details[0].message);

		const [hashtags, count] = await Promise.all([
			this.getItems(params),
			this.getCount(params),
		]);

		return SearchResultObject.create<HashtagObject>(
			hashtags.map((hashtag) =>
				HashtagObject.create(permissionContext, hashtag),
			),
			count,
		);
	}
}
