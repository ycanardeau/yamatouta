import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import Joi from 'joi';

import { ArtistObject } from '../../../dto/artists/ArtistObject';
import { Artist } from '../../../entities/Artist';
import { ArtistOptionalField } from '../../../models/ArtistOptionalField';
import { PermissionContext } from '../../../services/PermissionContext';
import { whereNotDeleted, whereNotHidden } from '../../../services/filters';

export class GetArtistParams {
	static readonly schema = Joi.object<GetArtistParams>({
		artistId: Joi.number().optional(),
		fields: Joi.array().items(
			Joi.string()
				.required()
				.trim()
				.valid(...Object.values(ArtistOptionalField)),
		),
	});

	constructor(
		readonly artistId: number,
		readonly fields?: ArtistOptionalField[],
	) {}
}

export class GetArtistQuery {
	constructor(
		readonly permissionContext: PermissionContext,
		readonly params: GetArtistParams,
	) {}
}

@QueryHandler(GetArtistQuery)
export class GetArtistQueryHandler implements IQueryHandler<GetArtistQuery> {
	constructor(
		@InjectRepository(Artist)
		private readonly artistRepo: EntityRepository<Artist>,
	) {}

	async execute(query: GetArtistQuery): Promise<ArtistObject> {
		const { permissionContext, params } = query;

		const artist = await this.artistRepo.findOne(
			{
				id: params.artistId,
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
