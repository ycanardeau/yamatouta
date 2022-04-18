import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, NotFoundException } from '@nestjs/common';

import { ArtistObject } from '../../../dto/artists/ArtistObject';
import { Artist } from '../../../entities/Artist';
import { PermissionContext } from '../../PermissionContext';
import { whereNotDeleted, whereNotHidden } from '../../filters';

export class GetArtistQuery {
	constructor(readonly artistId: number) {}
}

@Injectable()
export class GetArtistQueryHandler {
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
