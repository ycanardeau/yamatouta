import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, NotFoundException } from '@nestjs/common';

import { QuoteObject } from '../../dto/quotes/QuoteObject';
import { Quote } from '../../entities/Quote';

@Injectable()
export class GetQuoteService {
	constructor(
		@InjectRepository(Quote)
		private readonly quoteRepo: EntityRepository<Quote>,
	) {}

	async getQuote(quoteId: number): Promise<QuoteObject> {
		const quote = await this.quoteRepo.findOne(
			{
				id: quoteId,
				deleted: false,
				hidden: false,
			},
			{ populate: ['artist'] },
		);

		if (!quote) throw new NotFoundException();

		return new QuoteObject(quote);
	}
}
