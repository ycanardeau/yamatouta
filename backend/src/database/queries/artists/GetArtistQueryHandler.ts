import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { ArtistObject } from '../../../dto/artists/ArtistObject';
import { Artist } from '../../../entities/Artist';
import { PermissionContext } from '../../../services/PermissionContext';
import { whereNotDeleted, whereNotHidden } from '../../../services/filters';

export class GetArtistQuery {
	constructor(
		readonly permissionContext: PermissionContext,
		readonly artistId: number,
	) {}
}

@QueryHandler(GetArtistQuery)
export class GetArtistQueryHandler implements IQueryHandler<GetArtistQuery> {
	constructor(
		@InjectRepository(Artist)
		private readonly artistRepo: EntityRepository<Artist>,
	) {}

	async execute(query: GetArtistQuery): Promise<ArtistObject> {
		const artist = await this.artistRepo.findOne({
			id: query.artistId,
			$and: [
				whereNotDeleted(query.permissionContext),
				whereNotHidden(query.permissionContext),
			],
		});

		if (!artist) throw new NotFoundException();

		return new ArtistObject(artist, query.permissionContext);
	}
}
