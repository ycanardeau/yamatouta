import { QueryOrder, QueryOrderMap } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/mariadb';
import { Injectable } from '@nestjs/common';

import { SearchResultObject } from '../../dto/SearchResultObject';
import { QuoteObject } from '../../dto/quotes/QuoteObject';
import { QuoteSortRule } from '../../dto/quotes/QuoteSortRule';
import { Quote, QuoteType } from '../../entities/Quote';

@Injectable()
export class ListQuotesService {
	private static readonly defaultLimit = 10;
	private static readonly maxLimit = 100;
	private static readonly maxOffset = 5000;

	constructor(private readonly em: EntityManager) {}

	private orderBy(sort?: QuoteSortRule): QueryOrderMap {
		switch (sort) {
			default:
				return { id: QueryOrder.ASC };
		}
	}

	listQuotes(params: {
		quoteType?: QuoteType;
		sort?: QuoteSortRule;
		offset?: number;
		limit?: number;
		getTotalCount?: boolean;
		artistId?: number;
	}): Promise<SearchResultObject<QuoteObject>> {
		const { quoteType, sort, offset, limit, getTotalCount, artistId } =
			params;

		return this.em.transactional(async (em) => {
			const qb = em
				.createQueryBuilder(Quote)
				.andWhere({ deleted: false, hidden: false })
				.andWhere({ $not: { quoteType: QuoteType.Word } });

			if (quoteType) qb.andWhere({ quoteType: quoteType });
			if (artistId) qb.andWhere({ artist: artistId });

			const getItems = async (): Promise<Quote[]> => {
				if (offset && offset > ListQuotesService.maxOffset) return [];

				const idsQB = qb
					.clone()
					.select('id')
					.limit(
						limit
							? Math.min(limit, ListQuotesService.maxLimit)
							: ListQuotesService.defaultLimit,
						offset,
					);

				const orderBy = this.orderBy(sort);
				idsQB.orderBy(orderBy);

				const ids = (await idsQB.execute<{ id: number }[]>()).map(
					(x) => x.id,
				);

				return em.find(
					Quote,
					{ id: { $in: ids } },
					{
						orderBy: orderBy,
						populate: ['artist'],
					},
				);
			};

			const getCount = async (): Promise<number> => {
				if (!getTotalCount) return 0;

				return (
					await qb.clone().count().execute<{ count: number }[]>()
				)[0].count;
			};

			const [quotes, count] = await Promise.all([getItems(), getCount()]);

			return new SearchResultObject<QuoteObject>(
				quotes.map((quote) => new QuoteObject(quote)),
				count,
			);
		});
	}
}
