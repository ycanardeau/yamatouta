import {
	FilterQuery,
	FindOptions,
	QueryOrder,
	QueryOrderMap,
} from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { ArtistObject } from '../../../dto/ArtistObject';
import { SearchResultObject } from '../../../dto/SearchResultObject';
import { Artist } from '../../../entities/Artist';
import { ArtistListParams } from '../../../models/artists/ArtistListParams';
import { ArtistSortRule } from '../../../models/artists/ArtistSortRule';
import { PermissionContext } from '../../../services/PermissionContext';
import { whereNotHidden } from '../../../services/filters';

export class ArtistListQuery {
	constructor(
		readonly permissionContext: PermissionContext,
		readonly params: ArtistListParams,
	) {}
}

@QueryHandler(ArtistListQuery)
export class ArtistListQueryHandler implements IQueryHandler<ArtistListQuery> {
	private static readonly defaultLimit = 10;
	private static readonly maxLimit = 100;
	private static readonly maxOffset = 5000;

	constructor(
		@InjectRepository(Artist)
		private readonly artistRepo: EntityRepository<Artist>,
	) {}

	private orderBy(sort?: ArtistSortRule): QueryOrderMap<{ id: QueryOrder }> {
		switch (sort) {
			default:
				return { id: QueryOrder.ASC };
		}
	}

	async execute(
		query: ArtistListQuery,
	): Promise<SearchResultObject<ArtistObject>> {
		const { permissionContext, params } = query;

		const where: FilterQuery<Artist> = {
			$and: [
				{ deleted: false },
				whereNotHidden(permissionContext),
				params.artistType ? { artistType: params.artistType } : {},
				params.query ? { name: { $like: `%${params.query}%` } } : {},
			],
		};

		const options: FindOptions<Artist> = {
			limit: params.limit
				? Math.min(params.limit, ArtistListQueryHandler.maxLimit)
				: ArtistListQueryHandler.defaultLimit,
			offset: params.offset,
		};

		const [artists, count] = await Promise.all([
			params.offset && params.offset > ArtistListQueryHandler.maxOffset
				? Promise.resolve([])
				: this.artistRepo.find(where, {
						...options,
						orderBy: this.orderBy(params.sort),
				  }),
			params.getTotalCount
				? this.artistRepo.count(where, options)
				: Promise.resolve(0),
		]);

		return new SearchResultObject<ArtistObject>(
			artists.map(
				(artist) => new ArtistObject(artist, permissionContext),
			),
			count,
		);
	}
}
