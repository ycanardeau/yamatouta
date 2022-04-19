import {
	FilterQuery,
	FindOptions,
	QueryOrder,
	QueryOrderMap,
} from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import Joi, { ObjectSchema } from 'joi';

import { SearchResultObject } from '../../../dto/SearchResultObject';
import { QuoteObject } from '../../../dto/quotes/QuoteObject';
import { Quote } from '../../../entities/Quote';
import { QuoteSortRule } from '../../../models/QuoteSortRule';
import { QuoteType } from '../../../models/QuoteType';
import { PermissionContext } from '../../../services/PermissionContext';
import { whereNotHidden } from '../../../services/filters';

export class ListQuotesQuery {
	static readonly schema: ObjectSchema<ListQuotesQuery> = Joi.object({
		quoteType: Joi.string()
			.optional()
			.valid(...Object.values(QuoteType)),
		offset: Joi.number().optional(),
		limit: Joi.number().optional(),
		getTotalCount: Joi.boolean().optional(),
		artistId: Joi.number().optional(),
	});

	constructor(
		readonly quoteType?: QuoteType,
		readonly sort?: QuoteSortRule,
		readonly offset?: number,
		readonly limit?: number,
		readonly getTotalCount?: boolean,
		readonly artistId?: number,
	) {}
}

@QueryHandler(ListQuotesQuery)
export class ListQuotesQueryHandler implements IQueryHandler<ListQuotesQuery> {
	private static readonly defaultLimit = 10;
	private static readonly maxLimit = 100;
	private static readonly maxOffset = 5000;

	constructor(
		@InjectRepository(Quote)
		private readonly quoteRepo: EntityRepository<Quote>,
		private readonly permissionContext: PermissionContext,
	) {}

	private orderBy(sort?: QuoteSortRule): QueryOrderMap<{ id: QueryOrder }> {
		switch (sort) {
			default:
				return { id: QueryOrder.ASC };
		}
	}

	async execute(
		query: ListQuotesQuery,
	): Promise<SearchResultObject<QuoteObject>> {
		const where: FilterQuery<Quote> = {
			$and: [
				{ deleted: false },
				whereNotHidden(this.permissionContext),
				{ $not: { quoteType: QuoteType.Word } },
				query.quoteType ? { quoteType: query.quoteType } : {},
				query.artistId ? { artist: query.artistId } : {},
			],
		};

		const options: FindOptions<Quote, 'artist'> = {
			limit: query.limit
				? Math.min(query.limit, ListQuotesQueryHandler.maxLimit)
				: ListQuotesQueryHandler.defaultLimit,
			offset: query.offset,
			populate: ['artist'],
		};

		const [quotes, count] = await Promise.all([
			query.offset && query.offset > ListQuotesQueryHandler.maxOffset
				? Promise.resolve([])
				: this.quoteRepo.find(where, {
						...options,
						orderBy: this.orderBy(query.sort),
				  }),
			query.getTotalCount
				? this.quoteRepo.count(where, options)
				: Promise.resolve(0),
		]);

		return new SearchResultObject<QuoteObject>(
			quotes.map(
				(quote) => new QuoteObject(quote, this.permissionContext),
			),
			count,
		);
	}
}
