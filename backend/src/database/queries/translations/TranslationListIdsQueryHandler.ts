import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { Translation } from '../../../entities/Translation';

export class TranslationListIdsQuery {}

@QueryHandler(TranslationListIdsQuery)
export class TranslationListIdsQueryHandler
	implements IQueryHandler<TranslationListIdsQuery>
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
