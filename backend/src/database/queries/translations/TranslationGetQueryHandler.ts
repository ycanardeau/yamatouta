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

export class TranslationGetParams {
	static readonly schema = Joi.object<TranslationGetParams>({
		id: Joi.number().required(),
		fields: Joi.array().items(
			Joi.string()
				.required()
				.trim()
				.valid(...Object.values(TranslationOptionalField)),
		),
	});

	constructor(
		readonly id: number,
		readonly fields?: TranslationOptionalField[],
	) {}
}

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

		return new TranslationObject(
			translation,
			permissionContext,
			params.fields,
		);
	}
}
