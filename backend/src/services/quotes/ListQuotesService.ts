import {
	FilterQuery,
	FindOptions,
	QueryOrder,
	QueryOrderMap,
} from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';

import { SearchResultObject } from '../../dto/SearchResultObject';
import { QuoteObject } from '../../dto/quotes/QuoteObject';
import { QuoteSortRule } from '../../dto/quotes/QuoteSortRule';
import { ArtistQuote } from '../../entities/ArtistQuote';
import { Quote, QuoteType } from '../../entities/Quote';

@Injectable()
export class ListQuotesService {
	private static readonly defaultLimit = 10;
	private static readonly maxLimit = 100;
	private static readonly maxOffset = 5000;

	constructor(
		@InjectRepository(Quote)
		private readonly quoteRepo: EntityRepository<Quote>,
	) {}

	private orderBy(sort?: QuoteSortRule): QueryOrderMap {
		switch (sort) {
			default:
				return { id: QueryOrder.ASC };
		}
	}

	async listQuotes(params: {
		quoteType?: QuoteType;
		sort?: QuoteSortRule;
		offset?: number;
		limit?: number;
		getTotalCount?: boolean;
		artistId?: number;
	}): Promise<SearchResultObject<QuoteObject>> {
		const { quoteType, sort, offset, limit, getTotalCount, artistId } =
			params;

		const where: FilterQuery<ArtistQuote> = {
			$and: [
				{ deleted: false },
				{ hidden: false },
				{ $not: { quoteType: QuoteType.Word } },
				quoteType ? { quoteType: quoteType } : {},
				artistId ? { artist: artistId } : {},
			],
		};

		const options: FindOptions<Quote> = {
			limit: limit
				? Math.min(limit, ListQuotesService.maxLimit)
				: ListQuotesService.defaultLimit,
			offset: offset,
			populate: ['artist'],
		};

		const [quotes, count] = await Promise.all([
			offset && offset > ListQuotesService.maxOffset
				? Promise.resolve([])
				: this.quoteRepo.find(where, {
						...options,
						orderBy: this.orderBy(sort),
				  }),
			getTotalCount
				? this.quoteRepo.count(where, options)
				: Promise.resolve(0),
		]);

		return new SearchResultObject<QuoteObject>(
			quotes.map((quote) => new QuoteObject(quote)),
			count,
		);
	}
}
