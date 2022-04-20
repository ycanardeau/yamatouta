import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { TranslationObject } from '../../../dto/translations/TranslationObject';
import { Translation } from '../../../entities/Translation';
import { PermissionContext } from '../../../services/PermissionContext';
import { whereNotDeleted, whereNotHidden } from '../../../services/filters';

export class GetTranslationParams {
	constructor(readonly translationId: number) {}
}

export class GetTranslationQuery {
	constructor(
		readonly permissionContext: PermissionContext,
		readonly params: GetTranslationParams,
	) {}
}

@QueryHandler(GetTranslationQuery)
export class GetTranslationQueryHandler
	implements IQueryHandler<GetTranslationQuery>
{
	constructor(
		@InjectRepository(Translation)
		private readonly translationRepo: EntityRepository<Translation>,
	) {}

	async execute(query: GetTranslationQuery): Promise<TranslationObject> {
		const { permissionContext, params } = query;

		const translation = await this.translationRepo.findOne({
			id: params.translationId,
			$and: [
				whereNotDeleted(permissionContext),
				whereNotHidden(permissionContext),
			],
		});

		if (!translation) throw new NotFoundException();

		return new TranslationObject(translation, permissionContext);
	}
}
