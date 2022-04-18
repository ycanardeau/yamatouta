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
import { CreateArtistCommandHandler } from '../services/commands/artists/CreateArtistCommandHandler';
import { UpdateArtistCommandHandler } from '../services/commands/artists/UpdateArtistCommandHandler';
import { DeleteArtistCommandHandler } from '../services/commands/entries/DeleteEntryCommandHandler';
import { GetArtistQueryHandler } from '../services/queries/artists/GetArtistQueryHandler';
import { ListArtistsQueryHandler } from '../services/queries/artists/ListArtistsQueryHandler';
import { ListArtistRevisionsQueryHandler } from '../services/queries/entries/ListEntryRevisionsQueryHandler';

@Controller('artists')
export class ArtistController {
	constructor(
		private readonly createArtistCommandHandler: CreateArtistCommandHandler,
		private readonly listArtistsQueryHandler: ListArtistsQueryHandler,
		private readonly getArtistQueryHandler: GetArtistQueryHandler,
		private readonly updateArtistCommandHandler: UpdateArtistCommandHandler,
		private readonly deleteArtistCommandHandler: DeleteArtistCommandHandler,
		private readonly listArtistRevisionsQueryHandler: ListArtistRevisionsQueryHandler,
	) {}

	@Post()
	createArtist(
		@Body(new JoiValidationPipe(updateArtistBodySchema))
		body: IUpdateArtistBody,
	): Promise<ArtistObject> {
		return this.createArtistCommandHandler.execute(body);
	}

	@Get()
	listArtists(
		@Query(new JoiValidationPipe(listArtistsQuerySchema))
		query: IListArtistsQuery,
	): Promise<SearchResultObject<ArtistObject>> {
		return this.listArtistsQueryHandler.execute(query);
	}

	@Get(':artistId')
	getArtist(
		@Param('artistId', ParseIntPipe) artistId: number,
	): Promise<ArtistObject> {
		return this.getArtistQueryHandler.execute(artistId);
	}

	@Patch(':artistId')
	updateArtist(
		@Param('artistId', ParseIntPipe) artistId: number,
		@Body(new JoiValidationPipe(updateArtistBodySchema))
		body: IUpdateArtistBody,
	): Promise<ArtistObject> {
		return this.updateArtistCommandHandler.execute(artistId, body);
	}

	@Delete(':artistId')
	deleteArtist(
		@Param('artistId', ParseIntPipe) artistId: number,
	): Promise<void> {
		return this.deleteArtistCommandHandler.execute(artistId);
	}

	@Get(':artistId/revisions')
	listArtistRevisions(
		@Param('artistId', ParseIntPipe) artistId: number,
	): Promise<SearchResultObject<RevisionObject>> {
		return this.listArtistRevisionsQueryHandler.execute(artistId);
	}
}
