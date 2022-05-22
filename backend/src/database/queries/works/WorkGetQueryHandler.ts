import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import Joi from 'joi';

import { WorkObject } from '../../../dto/WorkObject';
import { Work } from '../../../entities/Work';
import { WorkOptionalField } from '../../../models/WorkOptionalField';
import { PermissionContext } from '../../../services/PermissionContext';
import { whereNotDeleted, whereNotHidden } from '../../../services/filters';

export class WorkGetParams {
	static readonly schema = Joi.object<WorkGetParams>({
		id: Joi.number().required(),
		fields: Joi.array().items(
			Joi.string()
				.required()
				.trim()
				.valid(...Object.values(WorkOptionalField)),
		),
	});

	constructor(readonly id: number, readonly fields?: WorkOptionalField[]) {}
}

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
