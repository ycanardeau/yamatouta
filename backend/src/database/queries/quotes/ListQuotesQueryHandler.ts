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

import { QuoteObject } from '../../../dto/QuoteObject';
import { SearchResultObject } from '../../../dto/SearchResultObject';
import { Quote } from '../../../entities/Quote';
import { QuoteSortRule } from '../../../models/QuoteSortRule';
import { QuoteType } from '../../../models/QuoteType';
import { PermissionContext } from '../../../services/PermissionContext';
import { whereNotHidden } from '../../../services/filters';

export class ListQuotesParams {
	static readonly schema = Joi.object<ListQuotesParams>({
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

export class ListQuotesQuery {
	constructor(
		readonly permissionContext: PermissionContext,
		readonly params: ListQuotesParams,
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
		const { permissionContext, params } = query;

		const where: FilterQuery<Quote> = {
			$and: [
				{ deleted: false },
				whereNotHidden(permissionContext),
				{ $not: { quoteType: QuoteType.Word } },
				params.quoteType ? { quoteType: params.quoteType } : {},
				params.artistId ? { artist: params.artistId } : {},
			],
		};

		const options: FindOptions<Quote, 'artist'> = {
			limit: params.limit
				? Math.min(params.limit, ListQuotesQueryHandler.maxLimit)
				: ListQuotesQueryHandler.defaultLimit,
			offset: params.offset,
			populate: ['artist'],
		};

		const [quotes, count] = await Promise.all([
			params.offset && params.offset > ListQuotesQueryHandler.maxOffset
				? Promise.resolve([])
				: this.quoteRepo.find(where, {
						...options,
						orderBy: this.orderBy(params.sort),
				  }),
			params.getTotalCount
				? this.quoteRepo.count(where, options)
				: Promise.resolve(0),
		]);

		return new SearchResultObject<QuoteObject>(
			quotes.map((quote) => new QuoteObject(quote, permissionContext)),
			count,
		);
	}
}
