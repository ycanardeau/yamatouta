import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';

import { QuoteObject } from '../../dto/quotes/QuoteObject';
import { Quote } from '../../entities/Quote';

@Injectable()
export class GetQuoteService {
	constructor(private readonly em: EntityManager) {}

	async getQuote(quoteId: number): Promise<QuoteObject> {
		const quote = await this.em.findOneOrFail(
			Quote,
			{
				id: quoteId,
				deleted: false,
				hidden: false,
			},
			{ populate: ['artist'] },
		);

		return new QuoteObject(quote);
	}
}
