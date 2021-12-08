import { QueryOrder, QueryOrderMap } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';

import { SearchResultDto } from '../../dto/SearchResultDto';
import { ArtistDto } from '../../dto/artists/ArtistDto';
import { ArtistSortRule } from '../../dto/artists/ArtistSortRule';
import { Artist, ArtistType } from '../../entities/Artist';

@Injectable()
export class ListArtistsService {
	private static readonly defaultLimit = 10;
	private static readonly maxLimit = 100;

	constructor(private readonly em: EntityManager) {}

	private orderBy(sort?: ArtistSortRule): QueryOrderMap {
		switch (sort) {
			default:
				return { id: QueryOrder.ASC };
		}
	}

	listArtists({
		artistType,
		sort,
		offset,
		limit,
		getTotalCount,
	}: {
		artistType?: ArtistType;
		sort?: ArtistSortRule;
		offset?: number;
		limit?: number;
		getTotalCount?: boolean;
	}): Promise<SearchResultDto<ArtistDto>> {
		return this.em.transactional(async (em) => {
			const qb = em
				.createQueryBuilder(Artist)
				.andWhere({ deleted: false, hidden: false });

			if (artistType) qb.andWhere({ artistType: artistType });

			const getItems = async (): Promise<Artist[]> => {
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

			return new SearchResultDto<ArtistDto>(
				artists.map((artist) => new ArtistDto(artist)),
				count,
			);
		});
	}
}
