import { NotFoundError } from '@mikro-orm/core';
import { Controller, Get, NotFoundException } from '@nestjs/common';
import { AjvParams } from 'nestjs-ajv-glue/dist';

import { QuoteDto } from '../../../dto/quotes/QuoteDto';
import { GetQuoteService } from './get-quote.service';

interface IGetQuoteParams {
	quoteId: number;
}

const getQuoteParamsSchema = {
	$schema: 'http://json-schema.org/draft-07/schema#',
	properties: {
		quoteId: {
			type: 'number',
		},
	},
	required: ['quoteId'],
	type: 'object',
};

@Controller()
export class GetQuoteController {
	constructor(private readonly service: GetQuoteService) {}

	@Get('quotes/:quoteId')
	async getQuote(
		@AjvParams(getQuoteParamsSchema) { quoteId }: IGetQuoteParams,
	): Promise<QuoteDto> {
		try {
			return await this.service.getQuote(quoteId);
		} catch (error) {
			if (error instanceof NotFoundError) throw new NotFoundException();
			throw error;
		}
	}
}
