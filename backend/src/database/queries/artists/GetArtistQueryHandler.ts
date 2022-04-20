import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { ArtistObject } from '../../../dto/artists/ArtistObject';
import { Artist } from '../../../entities/Artist';
import { PermissionContext } from '../../../services/PermissionContext';
import { whereNotDeleted, whereNotHidden } from '../../../services/filters';

export class GetArtistParams {
	constructor(readonly artistId: number) {}
}

export class GetArtistQuery {
	constructor(
		readonly permissionContext: PermissionContext,
		readonly params: GetArtistParams,
	) {}
}

@QueryHandler(GetArtistQuery)
export class GetArtistQueryHandler implements IQueryHandler<GetArtistQuery> {
	constructor(
		@InjectRepository(Artist)
		private readonly artistRepo: EntityRepository<Artist>,
	) {}

	async execute(query: GetArtistQuery): Promise<ArtistObject> {
		const { permissionContext, params } = query;

		const artist = await this.artistRepo.findOne({
			id: params.artistId,
			$and: [
				whereNotDeleted(permissionContext),
				whereNotHidden(permissionContext),
			],
		});

		if (!artist) throw new NotFoundException();

		return new ArtistObject(artist, permissionContext);
	}
}
