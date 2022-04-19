import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { NotFoundException } from '@nestjs/common';

import { ArtistObject } from '../../../dto/artists/ArtistObject';
import { Artist } from '../../../entities/Artist';
import { PermissionContext } from '../../../services/PermissionContext';
import { whereNotDeleted, whereNotHidden } from '../../../services/filters';
import { IQueryHandler, QueryHandler } from '../IQueryHandler';

export class GetArtistQuery {
	constructor(readonly artistId: number) {}
}

@QueryHandler(GetArtistQuery)
export class GetArtistQueryHandler implements IQueryHandler<GetArtistQuery> {
	constructor(
		@InjectRepository(Artist)
		private readonly artistRepo: EntityRepository<Artist>,
		private readonly permissionContext: PermissionContext,
	) {}

	async execute(query: GetArtistQuery): Promise<ArtistObject> {
		const artist = await this.artistRepo.findOne({
			id: query.artistId,
			$and: [
				whereNotDeleted(this.permissionContext),
				whereNotHidden(this.permissionContext),
			],
		});

		if (!artist) throw new NotFoundException();

		return new ArtistObject(artist, this.permissionContext);
	}
}
