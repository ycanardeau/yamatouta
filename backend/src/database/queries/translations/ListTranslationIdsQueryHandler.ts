import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { Translation } from '../../../entities/Translation';

export class ListTranslationIdsQuery {}

@QueryHandler(ListTranslationIdsQuery)
export class ListTranslationIdsQueryHandler
	implements IQueryHandler<ListTranslationIdsQuery>
{
	constructor(
		@InjectRepository(Translation)
		private readonly translationRepo: EntityRepository<Translation>,
	) {}

	async execute(): Promise<number[]> {
		const translations = await this.translationRepo.find({
			deleted: false,
			hidden: false,
		});

		return translations.map((translation) => translation.id);
	}
}
