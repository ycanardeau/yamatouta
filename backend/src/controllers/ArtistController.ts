import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';

import { SearchResultObject } from '../dto/SearchResultObject';
import { ArtistObject } from '../dto/artists/ArtistObject';
import { JoiValidationPipe } from '../pipes/JoiValidationPipe';
import {
	IListArtistsQuery,
	listArtistsQuerySchema,
} from '../requests/artists/IListArtistsQuery';
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
		@Query(new JoiValidationPipe(listArtistsQuerySchema))
		query: IListArtistsQuery,
	): Promise<SearchResultObject<ArtistObject>> {
		return this.listArtistsService.listArtists(query);
	}

	@Get(':artistId')
	getArtist(
		@Param('artistId', ParseIntPipe) artistId: number,
	): Promise<ArtistObject> {
		return this.getArtistService.getArtist(artistId);
	}
}
