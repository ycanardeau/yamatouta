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
	Req,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Request } from 'express';

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
import { PermissionContext } from '../services/PermissionContext';

@Controller('artists')
export class ArtistController {
	constructor(
		private readonly queryBus: QueryBus,
		private readonly commandBus: CommandBus,
	) {}

	@Post()
	createArtist(
		@Req() request: Request,
		@Body(new JoiValidationPipe(UpdateArtistCommand.schema))
		command: UpdateArtistCommand,
	): Promise<ArtistObject> {
		return this.commandBus.execute(
			new CreateArtistCommand(
				new PermissionContext(request),
				command.artistId,
				command.name,
				command.artistType,
			),
		);
	}

	@Get()
	listArtists(
		@Req() request: Request,
		@Query(new JoiValidationPipe(ListArtistsQuery.schema))
		query: ListArtistsQuery,
	): Promise<SearchResultObject<ArtistObject>> {
		return this.queryBus.execute(
			new ListArtistsQuery(
				new PermissionContext(request),
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
		@Req() request: Request,
		@Param('artistId', ParseIntPipe) artistId: number,
	): Promise<ArtistObject> {
		return this.queryBus.execute(
			new GetArtistQuery(new PermissionContext(request), artistId),
		);
	}

	@Patch(':artistId')
	updateArtist(
		@Req() request: Request,
		@Param('artistId', ParseIntPipe) artistId: number,
		@Body(new JoiValidationPipe(UpdateArtistCommand.schema))
		command: UpdateArtistCommand,
	): Promise<ArtistObject> {
		return this.commandBus.execute(
			new UpdateArtistCommand(
				new PermissionContext(request),
				artistId,
				command.name,
				command.artistType,
			),
		);
	}

	@Delete(':artistId')
	deleteArtist(
		@Req() request: Request,
		@Param('artistId', ParseIntPipe) artistId: number,
	): Promise<void> {
		return this.commandBus.execute(
			new DeleteArtistCommand(new PermissionContext(request), artistId),
		);
	}

	@Get(':artistId/revisions')
	listArtistRevisions(
		@Req() request: Request,
		@Param('artistId', ParseIntPipe) artistId: number,
	): Promise<SearchResultObject<RevisionObject>> {
		return this.queryBus.execute(
			new ListArtistRevisionsQuery(
				new PermissionContext(request),
				artistId,
			),
		);
	}
}
