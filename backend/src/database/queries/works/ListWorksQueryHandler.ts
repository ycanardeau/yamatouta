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
import { WorkObject } from '../../../dto/works/WorkObject';
import { Work } from '../../../entities/Work';
import { WorkSortRule } from '../../../models/WorkSortRule';
import { WorkType } from '../../../models/WorkType';
import { PermissionContext } from '../../../services/PermissionContext';
import { whereNotHidden } from '../../../services/filters';

export class ListWorksQuery {
	static readonly schema: ObjectSchema<ListWorksQuery> = Joi.object({
		workType: Joi.string()
			.optional()
			.valid(...Object.values(WorkType)),
		offset: Joi.number().optional(),
		limit: Joi.number().optional(),
		getTotalCount: Joi.boolean().optional(),
		query: Joi.string().optional().allow(''),
	});

	constructor(
		readonly permissionContext: PermissionContext,
		readonly workType?: WorkType,
		readonly sort?: WorkSortRule,
		readonly offset?: number,
		readonly limit?: number,
		readonly getTotalCount?: boolean,
		readonly query?: string,
	) {}
}

@QueryHandler(ListWorksQuery)
export class ListWorksQueryHandler implements IQueryHandler<ListWorksQuery> {
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
		query: ListWorksQuery,
	): Promise<SearchResultObject<WorkObject>> {
		const where: FilterQuery<Work> = {
			$and: [
				{ deleted: false },
				whereNotHidden(query.permissionContext),
				query.workType ? { workType: query.workType } : {},
				query.query ? { name: { $like: `%${query.query}%` } } : {},
			],
		};

		const options: FindOptions<Work> = {
			limit: query.limit
				? Math.min(query.limit, ListWorksQueryHandler.maxLimit)
				: ListWorksQueryHandler.defaultLimit,
			offset: query.offset,
		};

		const [works, count] = await Promise.all([
			query.offset && query.offset > ListWorksQueryHandler.maxOffset
				? Promise.resolve([])
				: this.workRepo.find(where, {
						...options,
						orderBy: this.orderBy(query.sort),
				  }),
			query.getTotalCount
				? this.workRepo.count(where, options)
				: Promise.resolve(0),
		]);

		return new SearchResultObject<WorkObject>(
			works.map((work) => new WorkObject(work, query.permissionContext)),
			count,
		);
	}
}
