import Joi, { ObjectSchema } from 'joi';

import { ArtistType } from '../../models/ArtistType';

export interface IUpdateArtistBody {
	name: string;
	artistType: ArtistType;
}

export const updateArtistBodySchema: ObjectSchema<IUpdateArtistBody> =
	Joi.object({
		name: Joi.string().required().trim().max(200),
		artistType: Joi.string()
			.required()
			.trim()
			.valid(...Object.values(ArtistType)),
	});
