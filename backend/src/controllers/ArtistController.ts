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

import { CreateArtistCommandHandler } from '../database/commands/artists/CreateArtistCommandHandler';
import {
	UpdateArtistCommand,
	UpdateArtistCommandHandler,
} from '../database/commands/artists/UpdateArtistCommandHandler';
import { DeleteArtistCommandHandler } from '../database/commands/entries/DeleteEntryCommandHandler';
import { GetArtistQueryHandler } from '../database/queries/artists/GetArtistQueryHandler';
import {
	ListArtistsQuery,
	ListArtistsQueryHandler,
} from '../database/queries/artists/ListArtistsQueryHandler';
import { ListArtistRevisionsQueryHandler } from '../database/queries/entries/ListEntryRevisionsQueryHandler';
import { SearchResultObject } from '../dto/SearchResultObject';
import { ArtistObject } from '../dto/artists/ArtistObject';
import { RevisionObject } from '../dto/revisions/RevisionObject';
import { JoiValidationPipe } from '../pipes/JoiValidationPipe';

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
		@Body(new JoiValidationPipe(UpdateArtistCommand.schema))
		command: UpdateArtistCommand,
	): Promise<ArtistObject> {
		return this.createArtistCommandHandler.execute(command);
	}

	@Get()
	listArtists(
		@Query(new JoiValidationPipe(ListArtistsQuery.schema))
		query: ListArtistsQuery,
	): Promise<SearchResultObject<ArtistObject>> {
		return this.listArtistsQueryHandler.execute(query);
	}

	@Get(':artistId')
	getArtist(
		@Param('artistId', ParseIntPipe) artistId: number,
	): Promise<ArtistObject> {
		return this.getArtistQueryHandler.execute({ artistId: artistId });
	}

	@Patch(':artistId')
	updateArtist(
		@Param('artistId', ParseIntPipe) artistId: number,
		@Body(new JoiValidationPipe(UpdateArtistCommand.schema))
		command: UpdateArtistCommand,
	): Promise<ArtistObject> {
		return this.updateArtistCommandHandler.execute({
			...command,
			artistId: artistId,
		});
	}

	@Delete(':artistId')
	deleteArtist(
		@Param('artistId', ParseIntPipe) artistId: number,
	): Promise<void> {
		return this.deleteArtistCommandHandler.execute({ entryId: artistId });
	}

	@Get(':artistId/revisions')
	listArtistRevisions(
		@Param('artistId', ParseIntPipe) artistId: number,
	): Promise<SearchResultObject<RevisionObject>> {
		return this.listArtistRevisionsQueryHandler.execute({
			entryId: artistId,
		});
	}
}
