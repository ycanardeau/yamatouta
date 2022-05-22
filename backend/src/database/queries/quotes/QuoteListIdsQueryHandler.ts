import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { Quote } from '../../../entities/Quote';

export class QuoteListIdsQuery {}

@QueryHandler(QuoteListIdsQuery)
export class QuoteListIdsQueryHandler
	implements IQueryHandler<QuoteListIdsQuery>
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
