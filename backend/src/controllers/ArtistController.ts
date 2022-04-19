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
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { CreateArtistCommand } from '../database/commands/artists/CreateArtistCommandHandler';
import { UpdateArtistCommand } from '../database/commands/artists/UpdateArtistCommandHandler';
import { DeleteArtistCommand } from '../database/commands/entries/DeleteEntryCommandHandler';
import { GetArtistQuery } from '../database/queries/artists/GetArtistQueryHandler';
import { ListArtistsQuery } from '../database/queries/artists/ListArtistsQueryHandler';
import { ListArtistRevisionsQuery } from '../database/queries/entries/ListEntryRevisionsQueryHandler';
import { SearchResultObject } from '../dto/SearchResultObject';
import { ArtistObject } from '../dto/artists/ArtistObject';
import { RevisionObject } from '../dto/revisions/RevisionObject';
import { JoiValidationPipe } from '../pipes/JoiValidationPipe';

@Controller('artists')
export class ArtistController {
	constructor(
		private readonly queryBus: QueryBus,
		private readonly commandBus: CommandBus,
	) {}

	@Post()
	createArtist(
		@Body(new JoiValidationPipe(UpdateArtistCommand.schema))
		command: UpdateArtistCommand,
	): Promise<ArtistObject> {
		return this.commandBus.execute(
			new CreateArtistCommand(
				command.artistId,
				command.name,
				command.artistType,
			),
		);
	}

	@Get()
	listArtists(
		@Query(new JoiValidationPipe(ListArtistsQuery.schema))
		query: ListArtistsQuery,
	): Promise<SearchResultObject<ArtistObject>> {
		return this.queryBus.execute(
			new ListArtistsQuery(
				query.artistType,
				query.sort,
				query.offset,
				query.limit,
				query.getTotalCount,
				query.query,
			),
		);
	}

	@Get(':artistId')
	getArtist(
		@Param('artistId', ParseIntPipe) artistId: number,
	): Promise<ArtistObject> {
		return this.queryBus.execute(new GetArtistQuery(artistId));
	}

	@Patch(':artistId')
	updateArtist(
		@Param('artistId', ParseIntPipe) artistId: number,
		@Body(new JoiValidationPipe(UpdateArtistCommand.schema))
		command: UpdateArtistCommand,
	): Promise<ArtistObject> {
		return this.commandBus.execute(
			new UpdateArtistCommand(artistId, command.name, command.artistType),
		);
	}

	@Delete(':artistId')
	deleteArtist(
		@Param('artistId', ParseIntPipe) artistId: number,
	): Promise<void> {
		return this.commandBus.execute(new DeleteArtistCommand(artistId));
	}

	@Get(':artistId/revisions')
	listArtistRevisions(
		@Param('artistId', ParseIntPipe) artistId: number,
	): Promise<SearchResultObject<RevisionObject>> {
		return this.queryBus.execute(new ListArtistRevisionsQuery(artistId));
	}
}
