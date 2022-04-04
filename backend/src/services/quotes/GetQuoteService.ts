import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, NotFoundException } from '@nestjs/common';

import { QuoteObject } from '../../dto/quotes/QuoteObject';
import { Quote } from '../../entities/Quote';
import { PermissionContext } from '../PermissionContext';
import { whereNotDeleted, whereNotHidden } from '../filters';

@Injectable()
export class GetQuoteService {
	constructor(
		@InjectRepository(Quote)
		private readonly quoteRepo: EntityRepository<Quote>,
		private readonly permissionContext: PermissionContext,
	) {}

	async getQuote(quoteId: number): Promise<QuoteObject> {
		const quote = await this.quoteRepo.findOne(
			{
				id: quoteId,
				$and: [
					whereNotDeleted(this.permissionContext),
					whereNotHidden(this.permissionContext),
				],
			},
			{ populate: ['artist'] },
		);

		if (!quote) throw new NotFoundException();

		return new QuoteObject(quote, this.permissionContext);
	}
}
