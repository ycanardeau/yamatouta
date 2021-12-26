import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, NotFoundException } from '@nestjs/common';

import { ArtistObject } from '../../dto/artists/ArtistObject';
import { Artist } from '../../entities/Artist';

@Injectable()
export class GetArtistService {
	constructor(
		@InjectRepository(Artist)
		private readonly artistRepo: EntityRepository<Artist>,
	) {}

	async getArtist(artistId: number): Promise<ArtistObject> {
		const artist = await this.artistRepo.findOne({
			id: artistId,
			deleted: false,
			hidden: false,
		});

		if (!artist) throw new NotFoundException();

		return new ArtistObject(artist);
	}
}
