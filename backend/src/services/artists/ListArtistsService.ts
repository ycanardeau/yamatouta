import { QueryOrder, QueryOrderMap } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

import { SearchResultObject } from '../../dto/SearchResultObject';
import { ArtistObject } from '../../dto/artists/ArtistObject';
import { ArtistSortRule } from '../../dto/artists/ArtistSortRule';
import { Artist, ArtistType } from '../../entities/Artist';

@Injectable()
export class ListArtistsService {
	private static readonly defaultLimit = 10;
	private static readonly maxLimit = 100;
	private static readonly maxOffset = 5000;

	constructor(private readonly em: EntityManager) {}

	private orderBy(sort?: ArtistSortRule): QueryOrderMap {
		switch (sort) {
			default:
				return { id: QueryOrder.ASC };
		}
	}

	listArtists(params: {
		artistType?: ArtistType;
		sort?: ArtistSortRule;
		offset?: number;
		limit?: number;
		getTotalCount?: boolean;
	}): Promise<SearchResultObject<ArtistObject>> {
		const { artistType, sort, offset, limit, getTotalCount } = params;

		return this.em.transactional(async (em) => {
			const qb = em
				.createQueryBuilder(Artist)
				.andWhere({ deleted: false, hidden: false });

			if (artistType) qb.andWhere({ artistType: artistType });

			const getItems = async (): Promise<Artist[]> => {
				if (offset && offset > ListArtistsService.maxOffset) return [];

				const idsQB = qb
					.clone()
					.select('id')
					.limit(
						limit
							? Math.min(limit, ListArtistsService.maxLimit)
							: ListArtistsService.defaultLimit,
						offset,
					);

				const orderBy = this.orderBy(sort);
				idsQB.orderBy(orderBy);

				const ids = (await idsQB.execute<{ id: number }[]>()).map(
					(x) => x.id,
				);

				return em.find(
					Artist,
					{ id: { $in: ids } },
					{ orderBy: orderBy },
				);
			};

			const getCount = async (): Promise<number> => {
				if (!getTotalCount) return 0;

				return (
					await qb.clone().count().execute<{ count: number }[]>()
				)[0].count;
			};

			const [artists, count] = await Promise.all([
				getItems(),
				getCount(),
			]);

			return new SearchResultObject<ArtistObject>(
				artists.map((artist) => new ArtistObject(artist)),
				count,
			);
		});
	}
}
