import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';

import { QuoteDto } from '../../../dto/quotes/QuoteDto';
import { Quote } from '../../../entities/Quote';

@Injectable()
export class GetQuoteService {
	constructor(private readonly em: EntityManager) {}

	async getQuote(quoteId: number): Promise<QuoteDto> {
		const quote = await this.em.findOneOrFail(
			Quote,
			{
				id: quoteId,
				deleted: false,
				hidden: false,
			},
			{ populate: ['artist'] },
		);

		return new QuoteDto(quote);
	}
}
