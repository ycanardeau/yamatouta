import {
	FilterQuery,
	FindOptions,
	QueryOrder,
	QueryOrderMap,
} from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import Joi from 'joi';

import { ArtistObject } from '../../../dto/ArtistObject';
import { SearchResultObject } from '../../../dto/SearchResultObject';
import { Artist } from '../../../entities/Artist';
import { ArtistSortRule } from '../../../models/ArtistSortRule';
import { ArtistType } from '../../../models/ArtistType';
import { PermissionContext } from '../../../services/PermissionContext';
import { whereNotHidden } from '../../../services/filters';

export class ListArtistsParams {
	static readonly schema = Joi.object<ListArtistsParams>({
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

export class ListArtistsQuery {
	constructor(
		readonly permissionContext: PermissionContext,
		readonly params: ListArtistsParams,
	) {}
}

@QueryHandler(ListArtistsQuery)
export class ListArtistsQueryHandler
	implements IQueryHandler<ListArtistsQuery>
{
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
		query: ListArtistsQuery,
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
				? Math.min(params.limit, ListArtistsQueryHandler.maxLimit)
				: ListArtistsQueryHandler.defaultLimit,
			offset: params.offset,
		};

		const [artists, count] = await Promise.all([
			params.offset && params.offset > ListArtistsQueryHandler.maxOffset
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
