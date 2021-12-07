import { Controller, Get } from '@nestjs/common';
import { AjvQuery } from 'nestjs-ajv-glue/dist';

import { SearchResultDto } from '../../../dto/SearchResultDto';
import { ArtistDto } from '../../../dto/artists/ArtistDto';
import { ArtistSortRule } from '../../../dto/artists/ArtistSortRule';
import { ArtistType } from '../../../entities/Artist';
import { ListArtistsService } from './list-artists.service';

interface IListArtistsQuery {
	artistType?: ArtistType;
	sort?: ArtistSortRule;
	offset?: number;
	limit?: number;
	getTotalCount?: boolean;
}

const listArtistsQuerySchema = {
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

@Controller()
export class ListArtistsController {
	constructor(private readonly service: ListArtistsService) {}

	@Get('artists')
	listArtists(
		@AjvQuery(listArtistsQuerySchema) query: IListArtistsQuery,
	): Promise<SearchResultDto<ArtistDto>> {
		return this.service.listArtists(query);
	}
}
