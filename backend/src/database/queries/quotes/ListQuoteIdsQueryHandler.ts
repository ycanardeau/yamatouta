import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';

import { Quote } from '../../../entities/Quote';
import { IQueryHandler, QueryHandler } from '../IQueryHandler';

export class ListQuoteIdsQuery {}

@QueryHandler(ListQuoteIdsQuery)
export class ListQuoteIdsQueryHandler
	implements IQueryHandler<ListQuoteIdsQuery>
{
	constructor(
		@InjectRepository(Quote)
		private readonly quoteRepo: EntityRepository<Quote>,
	) {}

	async execute(): Promise<number[]> {
		const quotes = await this.quoteRepo.find({
			deleted: false,
			hidden: false,
		});

		return quotes.map((quote) => quote.id);
	}
}
