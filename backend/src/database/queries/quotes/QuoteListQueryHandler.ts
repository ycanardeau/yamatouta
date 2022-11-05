import { orderByIds } from '@/database/queries/orderByIds';
import { QuoteObject } from '@/dto/QuoteObject';
import { SearchResultObject } from '@/dto/SearchResultObject';
import { Artist } from '@/entities/Artist';
import { Hashtag } from '@/entities/Hashtag';
import { Quote } from '@/entities/Quote';
import { QuoteListParams } from '@/models/quotes/QuoteListParams';
import { QuoteSortRule } from '@/models/quotes/QuoteSortRule';
import { QuoteType } from '@/models/quotes/QuoteType';
import { NgramConverter } from '@/services/NgramConverter';
import { PermissionContext } from '@/services/PermissionContext';
import { EntityManager, Knex } from '@mikro-orm/mariadb';
import { BadRequestException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import _ from 'lodash';

export class QuoteListQuery {
	constructor(
		readonly permissionContext: PermissionContext,
		readonly params: QuoteListParams,
	) {}
}

@QueryHandler(QuoteListQuery)
export class QuoteListQueryHandler implements IQueryHandler<QuoteListQuery> {
	private static readonly defaultLimit = 10;
	private static readonly maxLimit = 100;
	private static readonly maxOffset = 5000;

	constructor(
		private readonly em: EntityManager,
		private readonly ngramConverter: NgramConverter,
	) {}

	private async getHashtagIds(names?: string[]): Promise<number[]> {
		if (!names) return [];

		const hashtags = await this.em.find(
			Hashtag,
			{
				deleted: false,
				hidden: false,
				name: { $in: names },
			},
			{ fields: ['id'] },
		);

		return hashtags.map((hashtag) => hashtag.id);
	}

	private createKnex(
		params: QuoteListParams,
		hashtagIds: number[],
	): Knex.QueryBuilder {
		const knex = this.em
			.createQueryBuilder(Quote)
			.getKnex()
			.andWhere('quotes.deleted', false)
			.andWhere('quotes.hidden', false)
			.andWhereNot('quotes.quote_type', QuoteType.Word);

		if (params.query) {
			knex.join(
				'quote_search_index',
				'quotes.id',
				'quote_search_index.quote_id',
			).andWhereRaw(
				'MATCH(quote_search_index.text) AGAINST(? IN BOOLEAN MODE)',
				this.ngramConverter.toQuery(params.query, 2),
			);
		}

		if (params.quoteType)
			knex.andWhere('quotes.quote_type', params.quoteType);

		if (params.artistId) knex.andWhere('quotes.artist_id', params.artistId);

		if (params.workId) {
			knex.join(
				'work_links',
				'quotes.id',
				'work_links.quote_id',
			).andWhere('work_links.related_work_id', params.workId);
		}

		for (const hashtagId of hashtagIds) {
			knex.whereExists((qb) =>
				qb
					.select('hashtag_links.id')
					.from('hashtag_links')
					.andWhereRaw('quotes.id = hashtag_links.quote_id')
					.andWhere('hashtag_links.related_hashtag_id', hashtagId),
			);
		}

		return knex;
	}

	private orderBy(
		knex: Knex.QueryBuilder,
		params: QuoteListParams,
	): Knex.QueryBuilder {
		switch (params.sort) {
			case QuoteSortRule.CreatedAsc:
			case undefined:
				return knex
					.orderBy('quotes.created_at', 'asc')
					.orderBy('quotes.id', 'asc');

			case QuoteSortRule.CreatedDesc:
				return knex
					.orderBy('quotes.created_at', 'desc')
					.orderBy('quotes.id', 'desc');

			case QuoteSortRule.UpdatedAsc:
				return knex
					.orderBy('quotes.updated_at', 'asc')
					.orderBy('quotes.id', 'asc');

			case QuoteSortRule.UpdatedDesc:
				return knex
					.orderBy('quotes.updated_at', 'desc')
					.orderBy('quotes.id', 'desc');
		}
	}

	private async getIds(
		params: QuoteListParams,
		hashtagIds: number[],
	): Promise<number[]> {
		const knex = this.createKnex(params, hashtagIds)
			.select('quotes.id')
			.limit(
				params.limit
					? Math.min(params.limit, QuoteListQueryHandler.maxLimit)
					: QuoteListQueryHandler.defaultLimit,
			);

		if (params.offset) knex.offset(params.offset);

		this.orderBy(knex, params);

		const ids = _.map(await this.em.execute(knex), 'id');

		return ids;
	}

	private async getItems(
		params: QuoteListParams,
		hashtagIds: number[],
	): Promise<Quote[]> {
		if (params.offset && params.offset > QuoteListQueryHandler.maxOffset)
			return [];

		const ids = await this.getIds(params, hashtagIds);

		const knex = this.em
			.createQueryBuilder(Quote)
			.getKnex()
			.whereIn('id', ids);

		orderByIds(knex, ids);

		const results = await this.em.execute(knex);

		return results.map((result) => this.em.map(Quote, result));
	}

	private async getCount(
		params: QuoteListParams,
		hashtagIds: number[],
	): Promise<number> {
		if (!params.getTotalCount) return 0;

		const knex = this.createKnex(params, hashtagIds).countDistinct(
			'quotes.id as count',
		);

		const count = _.map(await this.em.execute(knex), 'count')[0];

		return count;
	}

	async execute(
		query: QuoteListQuery,
	): Promise<SearchResultObject<QuoteObject>> {
		const { permissionContext, params } = query;

		const result = QuoteListParams.schema.validate(params, {
			convert: true,
		});

		if (result.error)
			throw new BadRequestException(result.error.details[0].message);

		const hashtagIds = await this.getHashtagIds(params.hashtags);

		const [quotes, count] = await Promise.all([
			this.getItems(params, hashtagIds),
			this.getCount(params, hashtagIds),
		]);

		// Populate artists.
		await this.em.find(Artist, {
			id: {
				$in: _.chain(quotes)
					.map((quote) => quote.artist.id)
					.uniq()
					.value(),
			},
		});

		return SearchResultObject.create<QuoteObject>(
			quotes.map((quote) => QuoteObject.create(permissionContext, quote)),
			count,
		);
	}
}
