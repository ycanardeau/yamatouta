import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, NotFoundException } from '@nestjs/common';

import { ArtistObject } from '../../dto/artists/ArtistObject';
import { Artist } from '../../entities/Artist';
import { PermissionContext } from '../PermissionContext';
import { whereNotDeleted, whereNotHidden } from '../filters';

@Injectable()
export class GetArtistService {
	constructor(
		@InjectRepository(Artist)
		private readonly artistRepo: EntityRepository<Artist>,
		private readonly permissionContext: PermissionContext,
	) {}

	async execute(artistId: number): Promise<ArtistObject> {
		const artist = await this.artistRepo.findOne({
			id: artistId,
			$and: [
				whereNotDeleted(this.permissionContext),
				whereNotHidden(this.permissionContext),
			],
		});

		if (!artist) throw new NotFoundException();

		return new ArtistObject(artist, this.permissionContext);
	}
}
