import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { WorkObject } from '../../../dto/works/WorkObject';
import { Work } from '../../../entities/Work';
import { PermissionContext } from '../../../services/PermissionContext';
import { whereNotDeleted, whereNotHidden } from '../../../services/filters';

export class GetWorkQuery {
	constructor(
		readonly permissionContext: PermissionContext,
		readonly workId: number,
	) {}
}

@QueryHandler(GetWorkQuery)
export class GetWorkQueryHandler implements IQueryHandler<GetWorkQuery> {
	constructor(
		@InjectRepository(Work)
		private readonly workRepo: EntityRepository<Work>,
	) {}

	async execute(query: GetWorkQuery): Promise<WorkObject> {
		const work = await this.workRepo.findOne({
			id: query.workId,
			$and: [
				whereNotDeleted(query.permissionContext),
				whereNotHidden(query.permissionContext),
			],
		});

		if (!work) throw new NotFoundException();

		return new WorkObject(work, query.permissionContext);
	}
}
