import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';

import { ArtistObject } from '../../dto/artists/ArtistObject';
import { Artist } from '../../entities/Artist';

@Injectable()
export class GetArtistService {
	constructor(private readonly em: EntityManager) {}

	async getArtist(artistId: number): Promise<ArtistObject> {
		const artist = await this.em.findOneOrFail(Artist, {
			id: artistId,
			deleted: false,
			hidden: false,
		});

		return new ArtistObject(artist);
	}
}
