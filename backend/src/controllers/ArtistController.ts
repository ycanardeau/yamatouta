import { Controller, Get } from '@nestjs/common';
import { AjvParams, AjvQuery } from 'nestjs-ajv-glue/dist';

import { SearchResultObject } from '../dto/SearchResultObject';
import { ArtistObject } from '../dto/artists/ArtistObject';
import {
	getArtistParamsSchema,
	IGetArtistParams,
} from '../requests/artists/IGetArtistParams';
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
		@AjvQuery(listArtistsQuerySchema)
		query: IListArtistsQuery,
	): Promise<SearchResultObject<ArtistObject>> {
		return this.listArtistsService.listArtists(query);
	}

	@Get(':artistId')
	getArtist(
		@AjvParams(getArtistParamsSchema)
		{ artistId }: IGetArtistParams,
	): Promise<ArtistObject> {
		return this.getArtistService.getArtist(artistId);
	}
}
