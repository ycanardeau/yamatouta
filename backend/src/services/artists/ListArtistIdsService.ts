import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';

import { Artist } from '../../entities/Artist';

@Injectable()
export class ListArtistIdsService {
	constructor(
		@InjectRepository(Artist)
		private readonly artistRepo: EntityRepository<Artist>,
	) {}

	async listArtistIds(): Promise<number[]> {
		const artists = await this.artistRepo.find({
			deleted: false,
			hidden: false,
		});

		return artists.map((artist) => artist.id);
	}
}