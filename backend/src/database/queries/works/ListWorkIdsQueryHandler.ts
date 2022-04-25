import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { Work } from '../../../entities/Work';

export class ListWorkIdsQuery {}

@QueryHandler(ListWorkIdsQuery)
export class ListWorkIdsQueryHandler
	implements IQueryHandler<ListWorkIdsQuery>
{
	constructor(
		@InjectRepository(Work)
		private readonly workRepo: EntityRepository<Work>,
	) {}

	async execute(): Promise<number[]> {
		const works = await this.workRepo.find({
			deleted: false,
			hidden: false,
		});

		return works.map((work) => work.id);
	}
}
