import Joi from 'joi';

import { QuoteOptionalField } from './QuoteOptionalField';

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
