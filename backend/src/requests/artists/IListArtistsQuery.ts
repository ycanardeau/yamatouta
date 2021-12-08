import { ArtistSortRule } from '../../dto/artists/ArtistSortRule';
import { ArtistType } from '../../entities/Artist';

export interface IListArtistsQuery {
	artistType?: ArtistType;
	sort?: ArtistSortRule;
	offset?: number;
	limit?: number;
	getTotalCount?: boolean;
}

export const listArtistsQuerySchema = {
	$schema: 'http://json-schema.org/draft-07/schema#',
	properties: {
		artistType: {
			enum: ['character', 'group', 'other', 'person'],
			type: 'string',
		},
		getTotalCount: {
			type: 'boolean',
		},
		limit: {
			type: 'number',
		},
		offset: {
			type: 'number',
		},
		sort: {
			//enum: [],
			type: 'string',
		},
	},
	type: 'object',
};
