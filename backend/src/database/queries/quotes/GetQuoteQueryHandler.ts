import { EntityRepository } from '@mikro-orm/core';
import { AutoPath } from '@mikro-orm/core/typings';
import { InjectRepository } from '@mikro-orm/nestjs';
import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import Joi from 'joi';

import { QuoteObject } from '../../../dto/quotes/QuoteObject';
import { Quote } from '../../../entities/Quote';
import { QuoteOptionalFields } from '../../../models/QuoteOptionalFields';
import { PermissionContext } from '../../../services/PermissionContext';
import { whereNotDeleted, whereNotHidden } from '../../../services/filters';

export class GetQuoteParams {
	static readonly schema = Joi.object<GetQuoteParams>({
		quoteId: Joi.number().optional(),
		fields: Joi.array().items(
			Joi.string()
				.required()
				.trim()
				.valid(...Object.values(QuoteOptionalFields)),
		),
	});

	constructor(
		readonly quoteId: number,
		readonly fields?: QuoteOptionalFields[],
	) {}
}

export class GetQuoteQuery {
	constructor(
		readonly permissionContext: PermissionContext,
		readonly params: GetQuoteParams,
	) {}
}

@QueryHandler(GetQuoteQuery)
export class GetQuoteQueryHandler implements IQueryHandler<GetQuoteQuery> {
	constructor(
		@InjectRepository(Quote)
		private readonly quoteRepo: EntityRepository<Quote>,
	) {}

	async execute(query: GetQuoteQuery): Promise<QuoteObject> {
		const { permissionContext, params } = query;

		const populate = (['artist'] as AutoPath<Quote, keyof Quote>[]).concat(
			params.fields?.includes(QuoteOptionalFields.WebLinks)
				? ['webLinks']
				: [],
		);

		const quote = await this.quoteRepo.findOne(
			{
				id: params.quoteId,
				$and: [
					whereNotDeleted(permissionContext),
					whereNotHidden(permissionContext),
				],
			},
			{ populate: populate },
		);

		if (!quote) throw new NotFoundException();

		return new QuoteObject(quote, permissionContext, params.fields);
	}
}
