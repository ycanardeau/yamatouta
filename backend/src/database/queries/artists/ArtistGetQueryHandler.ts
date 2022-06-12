import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { ArtistObject } from '../../../dto/ArtistObject';
import { Artist } from '../../../entities/Artist';
import { ArtistGetParams } from '../../../models/artists/ArtistGetParams';
import { PermissionContext } from '../../../services/PermissionContext';
import { whereNotDeleted, whereNotHidden } from '../../../services/filters';

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
			{
				// OPTIMIZE
				populate: [
					'hashtagLinks',
					'hashtagLinks.relatedHashtag',
					'webLinks',
					'webLinks.address',
				],
			},
		);

		if (!artist) throw new NotFoundException();

		return ArtistObject.create(artist, permissionContext, params.fields);
	}
}
