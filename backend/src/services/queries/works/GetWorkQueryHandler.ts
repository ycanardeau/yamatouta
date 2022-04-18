import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, NotFoundException } from '@nestjs/common';

import { WorkObject } from '../../../dto/works/WorkObject';
import { Work } from '../../../entities/Work';
import { PermissionContext } from '../../PermissionContext';
import { whereNotDeleted, whereNotHidden } from '../../filters';

export class GetWorkQuery {
	constructor(readonly workId: number) {}
}

@Injectable()
export class GetWorkQueryHandler {
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
