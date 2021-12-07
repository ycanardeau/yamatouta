import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';

import { ArtistDto } from '../../../dto/artists/ArtistDto';
import { Artist } from '../../../entities/Artist';

@Injectable()
export class GetArtistService {
	constructor(private readonly em: EntityManager) {}

	async getArtist(artistId: number): Promise<ArtistDto> {
		const artist = await this.em.findOneOrFail(Artist, {
			id: artistId,
			deleted: false,
			hidden: false,
		});

		return new ArtistDto(artist);
	}
}
