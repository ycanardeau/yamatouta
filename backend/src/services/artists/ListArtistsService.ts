import {
	FilterQuery,
	FindOptions,
	QueryOrder,
	QueryOrderMap,
} from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';

import { SearchResultObject } from '../../dto/SearchResultObject';
import { ArtistObject } from '../../dto/artists/ArtistObject';
import { Artist } from '../../entities/Artist';
import { ArtistSortRule } from '../../models/ArtistSortRule';
import { ArtistType } from '../../models/ArtistType';
import { PermissionContext } from '../PermissionContext';
import { whereNotDeleted, whereNotHidden } from '../filters';

@Injectable()
export class ListArtistsService {
	private static readonly defaultLimit = 10;
	private static readonly maxLimit = 100;
	private static readonly maxOffset = 5000;

	constructor(
		@InjectRepository(Artist)
		private readonly artistRepo: EntityRepository<Artist>,
		private readonly permissionContext: PermissionContext,
	) {}

	private orderBy(sort?: ArtistSortRule): QueryOrderMap<{ id: QueryOrder }> {
		switch (sort) {
			default:
				return { id: QueryOrder.ASC };
		}
	}

	async listArtists(params: {
		artistType?: ArtistType;
		sort?: ArtistSortRule;
		offset?: number;
		limit?: number;
		getTotalCount?: boolean;
	}): Promise<SearchResultObject<ArtistObject>> {
		const { artistType, sort, offset, limit, getTotalCount } = params;

		const where: FilterQuery<Artist> = {
			$and: [
				whereNotDeleted(this.permissionContext),
				whereNotHidden(this.permissionContext),
				artistType ? { artistType: artistType } : {},
			],
		};

		const options: FindOptions<Artist> = {
			limit: limit
				? Math.min(limit, ListArtistsService.maxLimit)
				: ListArtistsService.defaultLimit,
			offset: offset,
		};

		const [artists, count] = await Promise.all([
			offset && offset > ListArtistsService.maxOffset
				? Promise.resolve([])
				: this.artistRepo.find(where, {
						...options,
						orderBy: this.orderBy(sort),
				  }),
			getTotalCount
				? this.artistRepo.count(where, options)
				: Promise.resolve(0),
		]);

		return new SearchResultObject<ArtistObject>(
			artists.map(
				(artist) => new ArtistObject(artist, this.permissionContext),
			),
			count,
		);
	}
}
