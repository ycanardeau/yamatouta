import {
	FilterQuery,
	FindOptions,
	QueryOrder,
	QueryOrderMap,
} from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { QuoteObject } from '../../../dto/QuoteObject';
import { SearchResultObject } from '../../../dto/SearchResultObject';
import { Quote } from '../../../entities/Quote';
import { QuoteListParams } from '../../../models/quotes/QuoteListParams';
import { QuoteSortRule } from '../../../models/quotes/QuoteSortRule';
import { QuoteType } from '../../../models/quotes/QuoteType';
import { PermissionContext } from '../../../services/PermissionContext';
import { whereNotHidden } from '../../../services/filters';

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
		query: QuoteListQuery,
	): Promise<SearchResultObject<QuoteObject>> {
		const { permissionContext, params } = query;

		const result = QuoteListParams.schema.validate(params, {
			convert: true,
		});

		if (result.error)
			throw new BadRequestException(result.error.details[0].message);

		const where: FilterQuery<Quote> = {
			$and: [
				{ deleted: false },
				whereNotHidden(permissionContext),
				{ $not: { quoteType: QuoteType.Word } },
				params.quoteType ? { quoteType: params.quoteType } : {},
				params.artistId ? { artist: params.artistId } : {},
				params.workId
					? { workLinks: { relatedWork: params.workId } }
					: {},
			],
		};

		const options: FindOptions<Quote, 'artist'> = {
			limit: params.limit
				? Math.min(params.limit, QuoteListQueryHandler.maxLimit)
				: QuoteListQueryHandler.defaultLimit,
			offset: params.offset,
			populate: ['artist'],
		};

		const [quotes, count] = await Promise.all([
			params.offset && params.offset > QuoteListQueryHandler.maxOffset
				? Promise.resolve([])
				: this.quoteRepo.find(where, {
						...options,
						orderBy: this.orderBy(params.sort),
				  }),
			params.getTotalCount
				? this.quoteRepo.count(where, options)
				: Promise.resolve(0),
		]);

		return SearchResultObject.create<QuoteObject>(
			quotes.map((quote) => QuoteObject.create(quote, permissionContext)),
			count,
		);
	}
}
