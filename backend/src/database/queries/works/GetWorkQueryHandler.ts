import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import Joi from 'joi';

import { WorkObject } from '../../../dto/works/WorkObject';
import { Work } from '../../../entities/Work';
import { WorkOptionalFields } from '../../../models/WorkOptionalFields';
import { PermissionContext } from '../../../services/PermissionContext';
import { whereNotDeleted, whereNotHidden } from '../../../services/filters';

export class GetWorkParams {
	static readonly schema = Joi.object<GetWorkParams>({
		workId: Joi.number().optional(),
		fields: Joi.array().items(
			Joi.string()
				.required()
				.trim()
				.valid(...Object.values(WorkOptionalFields)),
		),
	});

	constructor(
		readonly workId: number,
		readonly fields?: WorkOptionalFields[],
	) {}
}

export class GetWorkQuery {
	constructor(
		readonly permissionContext: PermissionContext,
		readonly params: GetWorkParams,
	) {}
}

@QueryHandler(GetWorkQuery)
export class GetWorkQueryHandler implements IQueryHandler<GetWorkQuery> {
	constructor(
		@InjectRepository(Work)
		private readonly workRepo: EntityRepository<Work>,
	) {}

	async execute(query: GetWorkQuery): Promise<WorkObject> {
		const { permissionContext, params } = query;

		const work = await this.workRepo.findOne(
			{
				id: params.workId,
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
