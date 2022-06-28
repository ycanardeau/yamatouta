import { EntityManager, Knex } from '@mikro-orm/mariadb';
import { BadRequestException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import _ from 'lodash';

import { QuoteObject } from '../../../dto/QuoteObject';
import { SearchResultObject } from '../../../dto/SearchResultObject';
import { Artist } from '../../../entities/Artist';
import { Quote } from '../../../entities/Quote';
import { QuoteListParams } from '../../../models/quotes/QuoteListParams';
import { QuoteSortRule } from '../../../models/quotes/QuoteSortRule';
import { QuoteType } from '../../../models/quotes/QuoteType';
import { NgramConverter } from '../../../services/NgramConverter';
import { PermissionContext } from '../../../services/PermissionContext';
import { orderByIds } from '../orderByIds';

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

	private createKnex(params: QuoteListParams): Knex.QueryBuilder {
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

	private async getIds(params: QuoteListParams): Promise<number[]> {
		const knex = this.createKnex(params)
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

	private async getItems(params: QuoteListParams): Promise<Quote[]> {
		const ids = await this.getIds(params);

		const knex = this.em
			.createQueryBuilder(Quote)
			.getKnex()
			.whereIn('id', ids);

		orderByIds(knex, ids);

		const results = await this.em.execute(knex);

		return results.map((result) => this.em.map(Quote, result));
	}

	private async getCount(params: QuoteListParams): Promise<number> {
		const knex =
			this.createKnex(params).countDistinct('quotes.id as count');

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

		const [quotes, count] = await Promise.all([
			params.offset && params.offset > QuoteListQueryHandler.maxOffset
				? Promise.resolve([])
				: this.getItems(params),
			params.getTotalCount ? this.getCount(params) : Promise.resolve(0),
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
			quotes.map((quote) => QuoteObject.create(quote, permissionContext)),
			count,
		);
	}
}
