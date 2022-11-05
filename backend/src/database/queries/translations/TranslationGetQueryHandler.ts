import { TranslationObject } from '@/dto/TranslationObject';
import { Translation } from '@/entities/Translation';
import { TranslationGetParams } from '@/models/translations/TranslationGetParams';
import { PermissionContext } from '@/services/PermissionContext';
import { whereNotDeleted, whereNotHidden } from '@/services/filters';
import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

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
			{
				// OPTIMIZE
				populate: [
					'webLinks',
					'webLinks.address',
					'workLinks',
					'workLinks.relatedWork',
					'workLinks.linkType',
				],
			},
		);

		if (!translation) throw new NotFoundException();

		return TranslationObject.create(
			permissionContext,
			translation,
			params.fields,
		);
	}
}
