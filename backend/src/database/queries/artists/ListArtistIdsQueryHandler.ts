import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { Artist } from '../../../entities/Artist';

export class ListArtistIdsQuery {}

@QueryHandler(ListArtistIdsQuery)
export class ListArtistIdsQueryHandler
	implements IQueryHandler<ListArtistIdsQuery>
{
	constructor(
		@InjectRepository(Artist)
		private readonly artistRepo: EntityRepository<Artist>,
	) {}

	async execute(): Promise<number[]> {
		const artists = await this.artistRepo.find({
			deleted: false,
			hidden: false,
		});

		return artists.map((artist) => artist.id);
	}
}
