import Joi, { ObjectSchema } from 'joi';

import { QuoteType } from '../../models/QuoteType';

export interface IUpdateQuoteBody {
	text: string;
	quoteType: QuoteType;
	locale: string;
	artistId: number;
}

export const updateQuoteBodySchema: ObjectSchema<IUpdateQuoteBody> = Joi.object(
	{
		text: Joi.string().required().trim().max(200),
		quoteType: Joi.string()
			.required()
			.trim()
			.valid(...Object.values(QuoteType)),
		locale: Joi.string().required().trim(),
		artistId: Joi.number().required(),
	},
);
