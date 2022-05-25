import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { WorkObject } from '../../../dto/WorkObject';
import { Work } from '../../../entities/Work';
import { WorkGetParams } from '../../../models/works/WorkGetParams';
import { PermissionContext } from '../../../services/PermissionContext';
import { whereNotDeleted, whereNotHidden } from '../../../services/filters';

export class WorkGetQuery {
	constructor(
		readonly permissionContext: PermissionContext,
		readonly params: WorkGetParams,
	) {}
}

@QueryHandler(WorkGetQuery)
export class WorkGetQueryHandler implements IQueryHandler<WorkGetQuery> {
	constructor(
		@InjectRepository(Work)
		private readonly workRepo: EntityRepository<Work>,
	) {}

	async execute(query: WorkGetQuery): Promise<WorkObject> {
		const { permissionContext, params } = query;

		const work = await this.workRepo.findOne(
			{
				id: params.id,
				$and: [
					whereNotDeleted(permissionContext),
					whereNotHidden(permissionContext),
				],
			},
			{ populate: true },
		);

		if (!work) throw new NotFoundException();

		return new WorkObject(work, permissionContext, params.fields);
	}
}
