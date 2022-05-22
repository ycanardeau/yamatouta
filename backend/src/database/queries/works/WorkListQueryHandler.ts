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
import { WorkObject } from '../../../dto/WorkObject';
import { Work } from '../../../entities/Work';
import { WorkSortRule } from '../../../models/WorkSortRule';
import { WorkType } from '../../../models/WorkType';
import { PermissionContext } from '../../../services/PermissionContext';
import { whereNotHidden } from '../../../services/filters';

export class WorkListParams {
	static readonly schema = Joi.object<WorkListParams>({
		workType: Joi.string()
			.optional()
			.valid(...Object.values(WorkType)),
		offset: Joi.number().optional(),
		limit: Joi.number().optional(),
		getTotalCount: Joi.boolean().optional(),
		query: Joi.string().optional().allow(''),
	});

	constructor(
		readonly workType?: WorkType,
		readonly sort?: WorkSortRule,
		readonly offset?: number,
		readonly limit?: number,
		readonly getTotalCount?: boolean,
		readonly query?: string,
	) {}
}

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
		@InjectRepository(Work)
		private readonly workRepo: EntityRepository<Work>,
	) {}

	private orderBy(sort?: WorkSortRule): QueryOrderMap<{ id: QueryOrder }> {
		switch (sort) {
			default:
				return { id: QueryOrder.ASC };
		}
	}

	async execute(
		query: WorkListQuery,
	): Promise<SearchResultObject<WorkObject>> {
		const { permissionContext, params } = query;

		const where: FilterQuery<Work> = {
			$and: [
				{ deleted: false },
				whereNotHidden(permissionContext),
				params.workType ? { workType: params.workType } : {},
				params.query ? { name: { $like: `%${params.query}%` } } : {},
			],
		};

		const options: FindOptions<Work> = {
			limit: params.limit
				? Math.min(params.limit, WorkListQueryHandler.maxLimit)
				: WorkListQueryHandler.defaultLimit,
			offset: params.offset,
		};

		const [works, count] = await Promise.all([
			params.offset && params.offset > WorkListQueryHandler.maxOffset
				? Promise.resolve([])
				: this.workRepo.find(where, {
						...options,
						orderBy: this.orderBy(params.sort),
				  }),
			params.getTotalCount
				? this.workRepo.count(where, options)
				: Promise.resolve(0),
		]);

		return new SearchResultObject<WorkObject>(
			works.map((work) => new WorkObject(work, permissionContext)),
			count,
		);
	}
}
