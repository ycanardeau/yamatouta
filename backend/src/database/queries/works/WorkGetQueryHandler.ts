import { WorkDto } from '@/dto/WorkDto';
import { Work } from '@/entities/Work';
import { WorkGetParams } from '@/models/works/WorkGetParams';
import { PermissionContext } from '@/services/PermissionContext';
import { whereNotDeleted, whereNotHidden } from '@/services/filters';
import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

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

	async execute(query: WorkGetQuery): Promise<WorkDto> {
		const { permissionContext, params } = query;

		const work = await this.workRepo.findOne(
			{
				id: params.id,
				$and: [
					whereNotDeleted(permissionContext),
					whereNotHidden(permissionContext),
				],
			},
			{
				// OPTIMIZE
				populate: [
					'webLinks',
					'webLinks.address',
					'artistLinks',
					'artistLinks.relatedArtist',
					'artistLinks.linkType',
				],
			},
		);

		if (!work) throw new NotFoundException();

		return WorkDto.create(permissionContext, work, params.fields);
	}
}
