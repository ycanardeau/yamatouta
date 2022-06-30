import { EntityManager, Knex } from '@mikro-orm/mariadb';
import { BadRequestException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import _ from 'lodash';

import { SearchResultObject } from '../../../dto/SearchResultObject';
import { WorkObject } from '../../../dto/WorkObject';
import { Work } from '../../../entities/Work';
import { WorkListParams } from '../../../models/works/WorkListParams';
import { WorkSortRule } from '../../../models/works/WorkSortRule';
import { NgramConverter } from '../../../services/NgramConverter';
import { PermissionContext } from '../../../services/PermissionContext';
import { orderByIds } from '../orderByIds';

export class WorkListQuery {
	constructor(
		readonly permissionContext: PermissionContext,
		readonly params: WorkListParams,
	) {}
}

@QueryHandler(WorkListQuery)
export class WorkListQueryHandler implements IQueryHandler<WorkListQuery> {
	private static readonly defaultLimit = 10;
	private static readonly maxLimit = 100;
	private static readonly maxOffset = 5000;

	constructor(
		private readonly em: EntityManager,
		private readonly ngramConverter: NgramConverter,
	) {}

	private createKnex(params: WorkListParams): Knex.QueryBuilder {
		const knex = this.em
			.createQueryBuilder(Work)
			.getKnex()
			.andWhere('works.deleted', false)
			.andWhere('works.hidden', false);

		if (params.query) {
			knex.join(
				'work_search_index',
				'works.id',
				'work_search_index.work_id',
			).andWhereRaw(
				'MATCH(work_search_index.name) AGAINST(? IN BOOLEAN MODE)',
				this.ngramConverter.toQuery(params.query, 2),
			);
		}

		if (params.workType) knex.andWhere('works.work_type', params.workType);

		return knex;
	}

	private orderBy(
		knex: Knex.QueryBuilder,
		params: WorkListParams,
	): Knex.QueryBuilder {
		switch (params.sort) {
			case WorkSortRule.NameAsc:
				return knex
					.orderBy('works.sort_name', 'asc')
					.orderBy('works.name', 'asc')
					.orderBy('works.id', 'asc');

			case WorkSortRule.NameDesc:
				return knex
					.orderBy('works.sort_name', 'desc')
					.orderBy('works.name', 'desc')
					.orderBy('works.id', 'desc');

			case WorkSortRule.CreatedAsc:
			case undefined:
				return knex
					.orderBy('works.created_at', 'asc')
					.orderBy('works.id', 'asc');

			case WorkSortRule.CreatedDesc:
				return knex
					.orderBy('works.created_at', 'desc')
					.orderBy('works.id', 'desc');

			case WorkSortRule.UpdatedAsc:
				return knex
					.orderBy('works.updated_at', 'asc')
					.orderBy('works.id', 'asc');

			case WorkSortRule.UpdatedDesc:
				return knex
					.orderBy('works.updated_at', 'desc')
					.orderBy('works.id', 'desc');
		}
	}

	private async getIds(params: WorkListParams): Promise<number[]> {
		const knex = this.createKnex(params)
			.select('works.id')
			.limit(
				params.limit
					? Math.min(params.limit, WorkListQueryHandler.maxLimit)
					: WorkListQueryHandler.defaultLimit,
			);

		if (params.offset) knex.offset(params.offset);

		this.orderBy(knex, params);

		const ids = _.map(await this.em.execute(knex), 'id');

		return ids;
	}

	private async getItems(params: WorkListParams): Promise<Work[]> {
		if (params.offset && params.offset > WorkListQueryHandler.maxOffset)
			return [];

		const ids = await this.getIds(params);

		const knex = this.em
			.createQueryBuilder(Work)
			.getKnex()
			.whereIn('id', ids);

		orderByIds(knex, ids);

		const results = await this.em.execute(knex);

		return results.map((result) => this.em.map(Work, result));
	}

	private async getCount(params: WorkListParams): Promise<number> {
		if (!params.getTotalCount) return 0;

		const knex = this.createKnex(params).countDistinct('works.id as count');

		const count = _.map(await this.em.execute(knex), 'count')[0];

		return count;
	}

	async execute(
		query: WorkListQuery,
	): Promise<SearchResultObject<WorkObject>> {
		const { permissionContext, params } = query;

		const result = WorkListParams.schema.validate(params, {
			convert: true,
		});

		if (result.error)
			throw new BadRequestException(result.error.details[0].message);

		const [works, count] = await Promise.all([
			this.getItems(params),
			this.getCount(params),
		]);

		return SearchResultObject.create<WorkObject>(
			works.map((work) => WorkObject.create(work, permissionContext)),
			count,
		);
	}
}
