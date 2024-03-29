import { ArtistSortRule } from '@/models/artists/ArtistSortRule';
import { ArtistType } from '@/models/artists/ArtistType';
import Joi from 'joi';

export class ArtistListParams {
	constructor(
		readonly artistType?: ArtistType,
		readonly sort?: ArtistSortRule,
		readonly offset?: number,
		readonly limit?: number,
		readonly getTotalCount?: boolean,
		readonly query?: string,
	) {}

	static readonly schema = Joi.object<ArtistListParams>({
		artistType: Joi.string()
			.optional()
			.valid(...Object.values(ArtistType)),
		sort: Joi.string()
			.optional()
			.valid(...Object.values(ArtistSortRule)),
		offset: Joi.number().optional(),
		limit: Joi.number().optional(),
		getTotalCount: Joi.boolean().optional(),
		query: Joi.string().optional().trim().allow(''),
	});
}
