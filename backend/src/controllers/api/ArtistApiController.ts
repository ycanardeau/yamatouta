import { ArtistDeleteCommand } from '@/database/commands/EntryDeleteCommandHandler';
import { ArtistUpdateCommand } from '@/database/commands/artists/ArtistUpdateCommandHandler';
import { ArtistListRevisionsQuery } from '@/database/queries/EntryListRevisionsQueryHandler';
import { ArtistGetQuery } from '@/database/queries/artists/ArtistGetQueryHandler';
import { ArtistListQuery } from '@/database/queries/artists/ArtistListQueryHandler';
import { ArtistObject } from '@/dto/ArtistObject';
import { RevisionObject } from '@/dto/RevisionObject';
import { SearchResultObject } from '@/dto/SearchResultObject';
import { GetPermissionContext } from '@/framework/decorators/GetPermissionContext';
import { JoiValidationPipe } from '@/framework/pipes/JoiValidationPipe';
import { EntryDeleteParams } from '@/models/EntryDeleteParams';
import { EntryListRevisionsParams } from '@/models/EntryListRevisionsParams';
import { ArtistGetParams } from '@/models/artists/ArtistGetParams';
import { ArtistListParams } from '@/models/artists/ArtistListParams';
import { ArtistUpdateParams } from '@/models/artists/ArtistUpdateParams';
import { PermissionContext } from '@/services/PermissionContext';
import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

@Controller('api/artists')
export class ArtistApiController {
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
