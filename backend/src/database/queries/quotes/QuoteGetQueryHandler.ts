import { QuoteObject } from '@/dto/QuoteObject';
import { Quote } from '@/entities/Quote';
import { QuoteGetParams } from '@/models/quotes/QuoteGetParams';
import { PermissionContext } from '@/services/PermissionContext';
import { whereNotDeleted, whereNotHidden } from '@/services/filters';
import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class QuoteGetQuery {
	constructor(
		readonly permissionContext: PermissionContext,
		readonly params: QuoteGetParams,
	) {}
}

@QueryHandler(QuoteGetQuery)
export class QuoteGetQueryHandler implements IQueryHandler<QuoteGetQuery> {
	constructor(
		@InjectRepository(Quote)
		private readonly quoteRepo: EntityRepository<Quote>,
	) {}

	async execute(query: QuoteGetQuery): Promise<QuoteObject> {
		const { permissionContext, params } = query;

		const quote = await this.quoteRepo.findOne(
			{
				id: params.id,
				$and: [
					whereNotDeleted(permissionContext),
					whereNotHidden(permissionContext),
				],
			},
			{
				// OPTIMIZE
				populate: [
					'artist',
					'hashtagLinks',
					'hashtagLinks.relatedHashtag',
					'webLinks',
					'webLinks.address',
					'workLinks',
					'workLinks.relatedWork',
					'workLinks.linkType',
				],
			},
		);

		if (!quote) throw new NotFoundException();

		return QuoteObject.create(permissionContext, quote, params.fields);
	}
}
