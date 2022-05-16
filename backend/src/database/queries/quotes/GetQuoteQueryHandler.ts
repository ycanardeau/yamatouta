import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import Joi from 'joi';

import { QuoteObject } from '../../../dto/QuoteObject';
import { Quote } from '../../../entities/Quote';
import { QuoteOptionalField } from '../../../models/QuoteOptionalField';
import { PermissionContext } from '../../../services/PermissionContext';
import { whereNotDeleted, whereNotHidden } from '../../../services/filters';

export class GetQuoteParams {
	static readonly schema = Joi.object<GetQuoteParams>({
		quoteId: Joi.number().optional(),
		fields: Joi.array().items(
			Joi.string()
				.required()
				.trim()
				.valid(...Object.values(QuoteOptionalField)),
		),
	});

	constructor(
		readonly quoteId: number,
		readonly fields?: QuoteOptionalField[],
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

		const quote = await this.quoteRepo.findOne(
			{
				id: params.quoteId,
				$and: [
					whereNotDeleted(permissionContext),
					whereNotHidden(permissionContext),
				],
			},
			{ populate: true },
		);

		if (!quote) throw new NotFoundException();

		return new QuoteObject(quote, permissionContext, params.fields);
	}
}
