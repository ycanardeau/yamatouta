import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { TranslationObject } from '../../../dto/translations/TranslationObject';
import { Translation } from '../../../entities/Translation';
import { PermissionContext } from '../../../services/PermissionContext';
import { whereNotDeleted, whereNotHidden } from '../../../services/filters';

export class GetTranslationQuery {
	constructor(readonly translationId: number) {}
}

@QueryHandler(GetTranslationQuery)
export class GetTranslationQueryHandler
	implements IQueryHandler<GetTranslationQuery>
{
	constructor(
		@InjectRepository(Translation)
		private readonly translationRepo: EntityRepository<Translation>,
		private readonly permissionContext: PermissionContext,
	) {}

	async execute(query: GetTranslationQuery): Promise<TranslationObject> {
		const translation = await this.translationRepo.findOne({
			id: query.translationId,
			$and: [
				whereNotDeleted(this.permissionContext),
				whereNotHidden(this.permissionContext),
			],
		});

		if (!translation) throw new NotFoundException();

		return new TranslationObject(translation, this.permissionContext);
	}
}
