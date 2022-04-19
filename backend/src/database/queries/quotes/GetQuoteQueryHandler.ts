import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { QuoteObject } from '../../../dto/quotes/QuoteObject';
import { Quote } from '../../../entities/Quote';
import { PermissionContext } from '../../../services/PermissionContext';
import { whereNotDeleted, whereNotHidden } from '../../../services/filters';

export class GetQuoteQuery {
	constructor(
		readonly permissionContext: PermissionContext,
		readonly quoteId: number,
	) {}
}

@QueryHandler(GetQuoteQuery)
export class GetQuoteQueryHandler implements IQueryHandler<GetQuoteQuery> {
	constructor(
		@InjectRepository(Quote)
		private readonly quoteRepo: EntityRepository<Quote>,
	) {}

	async execute(query: GetQuoteQuery): Promise<QuoteObject> {
		const quote = await this.quoteRepo.findOne(
			{
				id: query.quoteId,
				$and: [
					whereNotDeleted(query.permissionContext),
					whereNotHidden(query.permissionContext),
				],
			},
			{ populate: ['artist'] },
		);

		if (!quote) throw new NotFoundException();

		return new QuoteObject(quote, query.permissionContext);
	}
}