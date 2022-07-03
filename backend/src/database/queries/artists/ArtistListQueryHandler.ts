import { EntityManager, Knex } from '@mikro-orm/mariadb';
import { BadRequestException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import _ from 'lodash';

import { ArtistObject } from '../../../dto/ArtistObject';
import { SearchResultObject } from '../../../dto/SearchResultObject';
import { Artist } from '../../../entities/Artist';
import { ArtistListParams } from '../../../models/artists/ArtistListParams';
import { ArtistSortRule } from '../../../models/artists/ArtistSortRule';
import { NgramConverter } from '../../../services/NgramConverter';
import { PermissionContext } from '../../../services/PermissionContext';
import { orderByIds } from '../orderByIds';

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
		private readonly em: EntityManager,
		private readonly ngramConverter: NgramConverter,
	) {}

	private createKnex(params: ArtistListParams): Knex.QueryBuilder {
		const knex = this.em
			.createQueryBuilder(Artist)
			.getKnex()
			.andWhere('artists.deleted', false)
			.andWhere('artists.hidden', false);

		if (params.query) {
			knex.join(
				'artist_search_index',
				'artists.id',
				'artist_search_index.artist_id',
			).andWhereRaw(
				'MATCH(artist_search_index.name) AGAINST(? IN BOOLEAN MODE)',
				this.ngramConverter.toQuery(params.query, 2),
			);
		}

		if (params.artistType)
			knex.andWhere('artists.artist_type', params.artistType);

		return knex;
	}

	private orderBy(
		knex: Knex.QueryBuilder,
		params: ArtistListParams,
	): Knex.QueryBuilder {
		switch (params.sort) {
			case ArtistSortRule.NameAsc:
				return knex
					.orderBy('artists.name', 'asc')
					.orderBy('artists.id', 'asc');

			case ArtistSortRule.NameDesc:
				return knex
					.orderBy('artists.name', 'desc')
					.orderBy('artists.id', 'desc');

			case ArtistSortRule.CreatedAsc:
			case undefined:
				return knex
					.orderBy('artists.created_at', 'asc')
					.orderBy('artists.id', 'asc');

			case ArtistSortRule.CreatedDesc:
				return knex
					.orderBy('artists.created_at', 'desc')
					.orderBy('artists.id', 'desc');

			case ArtistSortRule.UpdatedAsc:
				return knex
					.orderBy('artists.updated_at', 'asc')
					.orderBy('artists.id', 'asc');

			case ArtistSortRule.UpdatedDesc:
				return knex
					.orderBy('artists.updated_at', 'desc')
					.orderBy('artists.id', 'desc');
		}
	}

	private async getIds(params: ArtistListParams): Promise<number[]> {
		const knex = this.createKnex(params)
			.select('artists.id')
			.limit(
				params.limit
					? Math.min(params.limit, ArtistListQueryHandler.maxLimit)
					: ArtistListQueryHandler.defaultLimit,
			);

		if (params.offset) knex.offset(params.offset);

		this.orderBy(knex, params);

		const ids = _.map(await this.em.execute(knex), 'id');

		return ids;
	}

	private async getItems(params: ArtistListParams): Promise<Artist[]> {
		if (params.offset && params.offset > ArtistListQueryHandler.maxOffset)
			return [];

		const ids = await this.getIds(params);

		const knex = this.em
			.createQueryBuilder(Artist)
			.getKnex()
			.whereIn('id', ids);

		orderByIds(knex, ids);

		const results = await this.em.execute(knex);

		return results.map((result) => this.em.map(Artist, result));
	}

	private async getCount(params: ArtistListParams): Promise<number> {
		if (!params.getTotalCount) return 0;

		const knex = this.createKnex(params).countDistinct(
			'artists.id as count',
		);

		const count = _.map(await this.em.execute(knex), 'count')[0];

		return count;
	}

	async execute(
		query: ArtistListQuery,
	): Promise<SearchResultObject<ArtistObject>> {
		const { permissionContext, params } = query;

		const result = ArtistListParams.schema.validate(params, {
			convert: true,
		});

		if (result.error)
			throw new BadRequestException(result.error.details[0].message);

		const [artists, count] = await Promise.all([
			this.getItems(params),
			this.getCount(params),
		]);

		return SearchResultObject.create<ArtistObject>(
			artists.map((artist) =>
				ArtistObject.create(permissionContext, artist),
			),
			count,
		);
	}
}
