import Joi, { ObjectSchema } from 'joi';

import { ArtistSortRule } from '../../dto/artists/ArtistSortRule';
import { ArtistType } from '../../models/ArtistType';

export interface IListArtistsQuery {
	artistType?: ArtistType;
	sort?: ArtistSortRule;
	offset?: number;
	limit?: number;
	getTotalCount?: boolean;
}

export const listArtistsQuerySchema: ObjectSchema<IListArtistsQuery> =
	Joi.object({
		artistType: Joi.string()
			.optional()
			.valid(...Object.values(ArtistType)),
		offset: Joi.number().optional(),
		limit: Joi.number().optional(),
		getTotalCount: Joi.boolean().optional(),
	});
