import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import Joi from 'joi';

import { TranslationObject } from '../../../dto/TranslationObject';
import { Translation } from '../../../entities/Translation';
import { TranslationOptionalField } from '../../../models/TranslationOptionalField';
import { PermissionContext } from '../../../services/PermissionContext';
import { whereNotDeleted, whereNotHidden } from '../../../services/filters';

export class GetTranslationParams {
	static readonly schema = Joi.object<GetTranslationParams>({
		translationId: Joi.number().optional(),
		fields: Joi.array().items(
			Joi.string()
				.required()
				.trim()
				.valid(...Object.values(TranslationOptionalField)),
		),
	});

	constructor(
		readonly translationId: number,
		readonly fields?: TranslationOptionalField[],
	) {}
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

		const translation = await this.translationRepo.findOne(
			{
				id: params.translationId,
				$and: [
					whereNotDeleted(permissionContext),
					whereNotHidden(permissionContext),
				],
			},
			{ populate: true },
		);

		if (!translation) throw new NotFoundException();

		return new TranslationObject(
			translation,
			permissionContext,
			params.fields,
		);
	}
}
