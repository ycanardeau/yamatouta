import { QuoteOptionalField } from '@/models/quotes/QuoteOptionalField';
import Joi from 'joi';

export class QuoteGetParams {
	constructor(readonly id: number, readonly fields?: QuoteOptionalField[]) {}

	static readonly schema = Joi.object<QuoteGetParams>({
		id: Joi.number().required(),
		fields: Joi.array()
			.optional()
			.items(
				Joi.string()
					.required()
					.trim()
					.valid(...Object.values(QuoteOptionalField)),
			),
	});
}
