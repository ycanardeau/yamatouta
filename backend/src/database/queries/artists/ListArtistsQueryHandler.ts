import {
	FilterQuery,
	FindOptions,
	QueryOrder,
	QueryOrderMap,
} from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import Joi, { ObjectSchema } from 'joi';

import { SearchResultObject } from '../../../dto/SearchResultObject';
import { ArtistObject } from '../../../dto/artists/ArtistObject';
import { Artist } from '../../../entities/Artist';
import { ArtistSortRule } from '../../../models/ArtistSortRule';
import { ArtistType } from '../../../models/ArtistType';
import { PermissionContext } from '../../../services/PermissionContext';
import { whereNotHidden } from '../../../services/filters';

export class ListArtistsQuery {
	static readonly schema: ObjectSchema<ListArtistsQuery> = Joi.object({
		artistType: Joi.string()
			.optional()
			.valid(...Object.values(ArtistType)),
		offset: Joi.number().optional(),
		limit: Joi.number().optional(),
		getTotalCount: Joi.boolean().optional(),
		query: Joi.string().optional().allow(''),
	});

	constructor(
		readonly artistType?: ArtistType,
		readonly sort?: ArtistSortRule,
		readonly offset?: number,
		readonly limit?: number,
		readonly getTotalCount?: boolean,
		readonly query?: string,
	) {}
}

@Injectable()
export class ListArtistsQueryHandler {
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

	async execute(
		query: ListArtistsQuery,
	): Promise<SearchResultObject<ArtistObject>> {
		const where: FilterQuery<Artist> = {
			$and: [
				{ deleted: false },
				whereNotHidden(this.permissionContext),
				query.artistType ? { artistType: query.artistType } : {},
				query.query ? { name: { $like: `%${query.query}%` } } : {},
			],
		};

		const options: FindOptions<Artist> = {
			limit: query.limit
				? Math.min(query.limit, ListArtistsQueryHandler.maxLimit)
				: ListArtistsQueryHandler.defaultLimit,
			offset: query.offset,
		};

		const [artists, count] = await Promise.all([
			query.offset && query.offset > ListArtistsQueryHandler.maxOffset
				? Promise.resolve([])
				: this.artistRepo.find(where, {
						...options,
						orderBy: this.orderBy(query.sort),
				  }),
			query.getTotalCount
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
