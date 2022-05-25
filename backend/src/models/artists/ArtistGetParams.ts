import Joi from 'joi';

import { ArtistOptionalField } from './ArtistOptionalField';

export class ArtistGetParams {
	constructor(readonly id: number, readonly fields?: ArtistOptionalField[]) {}

	static readonly schema = Joi.object<ArtistGetParams>({
		id: Joi.number().required(),
		fields: Joi.array().items(
			Joi.string()
				.required()
				.trim()
				.valid(...Object.values(ArtistOptionalField)),
		),
	});
}
