import {
	EntityRepository,
	FilterQuery,
	FindOptions,
	QueryOrder,
	QueryOrderMap,
} from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { SearchResultObject } from '../../../dto/SearchResultObject';
import { WorkObject } from '../../../dto/WorkObject';
import { Work } from '../../../entities/Work';
import { WorkListParams } from '../../../models/works/WorkListParams';
import { WorkSortRule } from '../../../models/works/WorkSortRule';
import { PermissionContext } from '../../../services/PermissionContext';
import { whereNotHidden } from '../../../services/filters';

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

		return SearchResultObject.create<WorkObject>(
			works.map((work) => WorkObject.create(work, permissionContext)),
			count,
		);
	}
}
