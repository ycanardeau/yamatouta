import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';

import { SearchResultObject } from '../dto/SearchResultObject';
import { ArtistObject } from '../dto/artists/ArtistObject';
import { ArtistType } from '../entities/Artist';
import { ListArtistsQuery } from '../requests/artists/ListArtistsQuery';
import { GetArtistService } from '../services/artists/GetArtistService';
import { ListArtistsService } from '../services/artists/ListArtistsService';

@Controller('artists')
export class ArtistController {
	constructor(
		private readonly listArtistsService: ListArtistsService,
		private readonly getArtistService: GetArtistService,
	) {}

	@Get()
	listArtists(
		@Query() query: ListArtistsQuery,
	): Promise<SearchResultObject<ArtistObject>> {
		return this.listArtistsService.listArtists({
			artistType: ArtistType[query.artistType as keyof typeof ArtistType],
			// TODO: sort: ArtistSortRule[query.sort as keyof typeof ArtistSortRule],
			offset: Number(query.offset),
			limit: Number(query.limit),
			getTotalCount: query.getTotalCount === 'true',
		});
	}

	@Get(':artistId')
	getArtist(
		@Param('artistId', ParseIntPipe) artistId: number,
	): Promise<ArtistObject> {
		return this.getArtistService.getArtist(artistId);
	}
}
