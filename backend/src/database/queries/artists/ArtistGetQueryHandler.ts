import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import Joi from 'joi';

import { ArtistObject } from '../../../dto/ArtistObject';
import { Artist } from '../../../entities/Artist';
import { ArtistOptionalField } from '../../../models/ArtistOptionalField';
import { PermissionContext } from '../../../services/PermissionContext';
import { whereNotDeleted, whereNotHidden } from '../../../services/filters';

export class ArtistGetParams {
	constructor(readonly id: number, readonly fields?: ArtistOptionalField[]) {}

	static readonly schema = Joi.object<ArtistGetParams>({
		id: Joi.number().required(),
		fields: Joi.array().items(
			Joi.string()
				.required()
				.trim()
				.valid(...Object.values(ArtistOptionalField)),
		),
	});
}

export class ArtistGetQuery {
	constructor(
		readonly permissionContext: PermissionContext,
		readonly params: ArtistGetParams,
	) {}
}

@QueryHandler(ArtistGetQuery)
export class ArtistGetQueryHandler implements IQueryHandler<ArtistGetQuery> {
	constructor(
		@InjectRepository(Artist)
		private readonly artistRepo: EntityRepository<Artist>,
	) {}

	async execute(query: ArtistGetQuery): Promise<ArtistObject> {
		const { permissionContext, params } = query;

		const artist = await this.artistRepo.findOne(
			{
				id: params.id,
				$and: [
					whereNotDeleted(permissionContext),
					whereNotHidden(permissionContext),
				],
			},
			{ populate: true },
		);

		if (!artist) throw new NotFoundException();

		return new ArtistObject(artist, permissionContext, params.fields);
	}
}
