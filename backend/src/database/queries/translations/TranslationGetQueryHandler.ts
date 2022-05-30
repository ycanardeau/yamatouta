import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { TranslationObject } from '../../../dto/TranslationObject';
import { Translation } from '../../../entities/Translation';
import { TranslationGetParams } from '../../../models/translations/TranslationGetParams';
import { PermissionContext } from '../../../services/PermissionContext';
import { whereNotDeleted, whereNotHidden } from '../../../services/filters';

export class TranslationGetQuery {
	constructor(
		readonly permissionContext: PermissionContext,
		readonly params: TranslationGetParams,
	) {}
}

@QueryHandler(TranslationGetQuery)
export class TranslationGetQueryHandler
	implements IQueryHandler<TranslationGetQuery>
{
	constructor(
		@InjectRepository(Translation)
		private readonly translationRepo: EntityRepository<Translation>,
	) {}

	async execute(query: TranslationGetQuery): Promise<TranslationObject> {
		const { permissionContext, params } = query;

		const translation = await this.translationRepo.findOne(
			{
				id: params.id,
				$and: [
					whereNotDeleted(permissionContext),
					whereNotHidden(permissionContext),
				],
			},
			{ populate: true },
		);

		if (!translation) throw new NotFoundException();

		return TranslationObject.create(
			translation,
			permissionContext,
			params.fields,
		);
	}
}
