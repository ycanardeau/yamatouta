import { NotFoundError } from '@mikro-orm/core';
import { Controller, Get, NotFoundException } from '@nestjs/common';
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
	async getArtist(
		@AjvParams(getArtistParamsSchema)
		{ artistId }: IGetArtistParams,
	): Promise<ArtistObject> {
		try {
			return await this.getArtistService.getArtist(artistId);
		} catch (error) {
			if (error instanceof NotFoundError) throw new NotFoundException();
			throw error;
		}
	}
}
