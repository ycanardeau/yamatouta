import { ArtistDto } from '@/dto/ArtistDto';
import { Artist } from '@/entities/Artist';
import { ArtistGetParams } from '@/models/artists/ArtistGetParams';
import { PermissionContext } from '@/services/PermissionContext';
import { whereNotDeleted, whereNotHidden } from '@/services/filters';
import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

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

	async execute(query: ArtistGetQuery): Promise<ArtistDto> {
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
				populate: ['webLinks', 'webLinks.address'],
			},
		);

		if (!artist) throw new NotFoundException();

		return ArtistDto.create(permissionContext, artist, params.fields);
	}
}
