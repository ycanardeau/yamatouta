import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { NotFoundException } from '@nestjs/common';

import { WorkObject } from '../../../dto/works/WorkObject';
import { Work } from '../../../entities/Work';
import { PermissionContext } from '../../../services/PermissionContext';
import { whereNotDeleted, whereNotHidden } from '../../../services/filters';
import { IQueryHandler, QueryHandler } from '../IQueryHandler';

export class GetWorkQuery {
	constructor(readonly workId: number) {}
}

@QueryHandler(GetWorkQuery)
export class GetWorkQueryHandler implements IQueryHandler<GetWorkQuery> {
	constructor(
		@InjectRepository(Work)
		private readonly workRepo: EntityRepository<Work>,
		private readonly permissionContext: PermissionContext,
	) {}

	async execute(query: GetWorkQuery): Promise<WorkObject> {
		const work = await this.workRepo.findOne({
			id: query.workId,
			$and: [
				whereNotDeleted(this.permissionContext),
				whereNotHidden(this.permissionContext),
			],
		});

		if (!work) throw new NotFoundException();

		return new WorkObject(work, this.permissionContext);
	}
}
