import { ArtistOptionalField } from '@/models/artists/ArtistOptionalField';
import Joi from 'joi';

export class ArtistGetParams {
	constructor(readonly id: number, readonly fields?: ArtistOptionalField[]) {}

	static readonly schema = Joi.object<ArtistGetParams>({
		id: Joi.number().required(),
		fields: Joi.array()
			.optional()
			.items(
				Joi.string()
					.required()
					.trim()
					.valid(...Object.values(ArtistOptionalField)),
			),
	});
}
