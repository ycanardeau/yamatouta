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
import { WorkObject } from '../../dto/works/WorkObject';
import { Work } from '../../entities/Work';
import { WorkSortRule } from '../../models/WorkSortRule';
import { IListWorksQuery } from '../../requests/works/IListWorksQuery';
import { PermissionContext } from '../PermissionContext';
import { whereNotHidden } from '../filters';

@Injectable()
export class ListWorksService {
	private static readonly defaultLimit = 10;
	private static readonly maxLimit = 100;
	private static readonly maxOffset = 5000;

	constructor(
		@InjectRepository(Work)
		private readonly workRepo: EntityRepository<Work>,
		private readonly permissionContext: PermissionContext,
	) {}

	private orderBy(sort?: WorkSortRule): QueryOrderMap<{ id: QueryOrder }> {
		switch (sort) {
			default:
				return { id: QueryOrder.ASC };
		}
	}

	async execute(
		params: IListWorksQuery,
	): Promise<SearchResultObject<WorkObject>> {
		const { workType, sort, offset, limit, getTotalCount, query } = params;

		const where: FilterQuery<Work> = {
			$and: [
				{ deleted: false },
				whereNotHidden(this.permissionContext),
				workType ? { workType: workType } : {},
				query ? { name: { $like: `%${query}%` } } : {},
			],
		};

		const options: FindOptions<Work> = {
			limit: limit
				? Math.min(limit, ListWorksService.maxLimit)
				: ListWorksService.defaultLimit,
			offset: offset,
		};

		const [works, count] = await Promise.all([
			offset && offset > ListWorksService.maxOffset
				? Promise.resolve([])
				: this.workRepo.find(where, {
						...options,
						orderBy: this.orderBy(sort),
				  }),
			getTotalCount
				? this.workRepo.count(where, options)
				: Promise.resolve(0),
		]);

		return new SearchResultObject<WorkObject>(
			works.map((work) => new WorkObject(work, this.permissionContext)),
			count,
		);
	}
}
