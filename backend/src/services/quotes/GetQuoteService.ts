import { EntityManager } from '@mikro-orm/core';
import { Injectable, NotFoundException } from '@nestjs/common';

import { QuoteObject } from '../../dto/quotes/QuoteObject';
import { Quote } from '../../entities/Quote';

@Injectable()
export class GetQuoteService {
	constructor(private readonly em: EntityManager) {}

	async getQuote(quoteId: number): Promise<QuoteObject> {
		const quote = await this.em.findOne(
			Quote,
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
