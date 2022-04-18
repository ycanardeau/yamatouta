import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	Query,
} from '@nestjs/common';

import { SearchResultObject } from '../dto/SearchResultObject';
import { ArtistObject } from '../dto/artists/ArtistObject';
import { RevisionObject } from '../dto/revisions/RevisionObject';
import { JoiValidationPipe } from '../pipes/JoiValidationPipe';
import {
	IListArtistsQuery,
	listArtistsQuerySchema,
} from '../requests/artists/IListArtistsQuery';
import {
	IUpdateArtistBody,
	updateArtistBodySchema,
} from '../requests/artists/IUpdateArtistBody';
import { CreateArtistService } from '../services/artists/CreateArtistService';
import { GetArtistService } from '../services/artists/GetArtistService';
import { ListArtistsService } from '../services/artists/ListArtistsService';
import { UpdateArtistService } from '../services/artists/UpdateArtistService';
import { DeleteArtistService } from '../services/entries/DeleteEntryService';
import { ListArtistRevisionsService } from '../services/entries/ListEntryRevisionsService';

@Controller('artists')
export class ArtistController {
	constructor(
		private readonly createArtistService: CreateArtistService,
		private readonly listArtistsService: ListArtistsService,
		private readonly getArtistService: GetArtistService,
		private readonly updateArtistService: UpdateArtistService,
		private readonly deleteArtistService: DeleteArtistService,
		private readonly listArtistRevisionsService: ListArtistRevisionsService,
	) {}

	@Post()
	createArtist(
		@Body(new JoiValidationPipe(updateArtistBodySchema))
		body: IUpdateArtistBody,
	): Promise<ArtistObject> {
		return this.createArtistService.execute(body);
	}

	@Get()
	listArtists(
		@Query(new JoiValidationPipe(listArtistsQuerySchema))
		query: IListArtistsQuery,
	): Promise<SearchResultObject<ArtistObject>> {
		return this.listArtistsService.execute(query);
	}

	@Get(':artistId')
	getArtist(
		@Param('artistId', ParseIntPipe) artistId: number,
	): Promise<ArtistObject> {
		return this.getArtistService.execute(artistId);
	}

	@Patch(':artistId')
	updateArtist(
		@Param('artistId', ParseIntPipe) artistId: number,
		@Body(new JoiValidationPipe(updateArtistBodySchema))
		body: IUpdateArtistBody,
	): Promise<ArtistObject> {
		return this.updateArtistService.execute(artistId, body);
	}

	@Delete(':artistId')
	deleteArtist(
		@Param('artistId', ParseIntPipe) artistId: number,
	): Promise<void> {
		return this.deleteArtistService.execute(artistId);
	}

	@Get(':artistId/revisions')
	listArtistRevisions(
		@Param('artistId', ParseIntPipe) artistId: number,
	): Promise<SearchResultObject<RevisionObject>> {
		return this.listArtistRevisionsService.execute(artistId);
	}
}
