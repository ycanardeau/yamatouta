import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';

import { Quote } from '../../entities/Quote';

@Injectable()
export class ListQuoteIdsService {
	constructor(
		@InjectRepository(Quote)
		private readonly quoteRepo: EntityRepository<Quote>,
	) {}

	async listQuoteIds(): Promise<number[]> {
		const quotes = await this.quoteRepo.find({
			deleted: false,
			hidden: false,
		});

		return quotes.map((quote) => quote.id);
	}
}
