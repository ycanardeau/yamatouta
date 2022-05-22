import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import {
	ArtistUpdateCommand,
	ArtistUpdateParams,
} from '../database/commands/artists/ArtistUpdateCommandHandler';
import {
	ArtistDeleteCommand,
	EntryDeleteParams,
} from '../database/commands/entries/EntryDeleteCommandHandler';
import {
	ArtistGetParams,
	ArtistGetQuery,
} from '../database/queries/artists/ArtistGetQueryHandler';
import {
	ArtistListParams,
	ArtistListQuery,
} from '../database/queries/artists/ArtistListQueryHandler';
import {
	ArtistListRevisionsQuery,
	EntryListRevisionsParams,
} from '../database/queries/entries/EntryListRevisionsQueryHandler';
import { GetPermissionContext } from '../decorators/GetPermissionContext';
import { ArtistObject } from '../dto/ArtistObject';
import { RevisionObject } from '../dto/RevisionObject';
import { SearchResultObject } from '../dto/SearchResultObject';
import { JoiValidationPipe } from '../pipes/JoiValidationPipe';
import { PermissionContext } from '../services/PermissionContext';

@Controller('artists')
export class ArtistController {
	constructor(
		private readonly queryBus: QueryBus,
		private readonly commandBus: CommandBus,
	) {}

	@Post('create')
	create(
		@GetPermissionContext() permissionContext: PermissionContext,
		@Body(new JoiValidationPipe(ArtistUpdateParams.schema))
		params: ArtistUpdateParams,
	): Promise<ArtistObject> {
		return this.commandBus.execute(
			new ArtistUpdateCommand(permissionContext, params),
		);
	}

	@Delete('delete')
	delete(
		@GetPermissionContext() permissionContext: PermissionContext,
		@Body(new JoiValidationPipe(EntryDeleteParams.schema))
		params: EntryDeleteParams,
	): Promise<void> {
		return this.commandBus.execute(
			new ArtistDeleteCommand(permissionContext, params),
		);
	}

	@Get('get')
	get(
		@GetPermissionContext() permissionContext: PermissionContext,
		@Query(new JoiValidationPipe(ArtistGetParams.schema))
		params: ArtistGetParams,
	): Promise<ArtistObject> {
		return this.queryBus.execute(
			new ArtistGetQuery(permissionContext, params),
		);
	}

	@Get('list')
	list(
		@GetPermissionContext() permissionContext: PermissionContext,
		@Query(new JoiValidationPipe(ArtistListParams.schema))
		params: ArtistListParams,
	): Promise<SearchResultObject<ArtistObject>> {
		return this.queryBus.execute(
			new ArtistListQuery(permissionContext, params),
		);
	}

	@Get('list-revisions')
	listRevisions(
		@GetPermissionContext() permissionContext: PermissionContext,
		@Query(new JoiValidationPipe(EntryListRevisionsParams.schema))
		params: EntryListRevisionsParams,
	): Promise<SearchResultObject<RevisionObject>> {
		return this.queryBus.execute(
			new ArtistListRevisionsQuery(permissionContext, params),
		);
	}

	@Post('update')
	update(
		@GetPermissionContext() permissionContext: PermissionContext,
		@Body(new JoiValidationPipe(ArtistUpdateParams.schema))
		params: ArtistUpdateParams,
	): Promise<ArtistObject> {
		return this.commandBus.execute(
			new ArtistUpdateCommand(permissionContext, params),
		);
	}
}
