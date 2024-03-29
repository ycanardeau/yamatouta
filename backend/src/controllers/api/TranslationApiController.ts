import { TranslationDeleteCommand } from '@/database/commands/EntryDeleteCommandHandler';
import { TranslationUpdateCommand } from '@/database/commands/translations/TranslationUpdateCommandHandler';
import { TranslationListRevisionsQuery } from '@/database/queries/EntryListRevisionsQueryHandler';
import { TranslationGetQuery } from '@/database/queries/translations/TranslationGetQueryHandler';
import { TranslationListQuery } from '@/database/queries/translations/TranslationListQueryHandler';
import { RevisionDto } from '@/dto/RevisionDto';
import { SearchResultDto } from '@/dto/SearchResultDto';
import { TranslationDto } from '@/dto/TranslationDto';
import { GetPermissionContext } from '@/framework/decorators/GetPermissionContext';
import { JoiValidationPipe } from '@/framework/pipes/JoiValidationPipe';
import { EntryDeleteParams } from '@/models/EntryDeleteParams';
import { EntryListRevisionsParams } from '@/models/EntryListRevisionsParams';
import { TranslationGetParams } from '@/models/translations/TranslationGetParams';
import { TranslationListParams } from '@/models/translations/TranslationListParams';
import { TranslationUpdateParams } from '@/models/translations/TranslationUpdateParams';
import { PermissionContext } from '@/services/PermissionContext';
import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

@Controller('api/translations')
export class TranslationApiController {
	constructor(
		private readonly queryBus: QueryBus,
		private readonly commandBus: CommandBus,
	) {}

	@Post('create')
	create(
		@GetPermissionContext() permissionContext: PermissionContext,
		@Body(new JoiValidationPipe(TranslationUpdateParams.schema))
		params: TranslationUpdateParams,
	): Promise<TranslationDto> {
		return this.commandBus.execute(
			new TranslationUpdateCommand(permissionContext, params),
		);
	}

	@Delete('delete')
	delete(
		@GetPermissionContext() permissionContext: PermissionContext,
		@Body(new JoiValidationPipe(EntryDeleteParams.schema))
		params: EntryDeleteParams,
	): Promise<void> {
		return this.commandBus.execute(
			new TranslationDeleteCommand(permissionContext, params),
		);
	}

	@Get('get')
	get(
		@GetPermissionContext() permissionContext: PermissionContext,
		@Query(new JoiValidationPipe(TranslationGetParams.schema))
		params: TranslationGetParams,
	): Promise<TranslationDto> {
		return this.queryBus.execute(
			new TranslationGetQuery(permissionContext, params),
		);
	}

	@Get('list')
	list(
		@GetPermissionContext() permissionContext: PermissionContext,
		@Query(new JoiValidationPipe(TranslationListParams.schema))
		params: TranslationListParams,
	): Promise<SearchResultDto<TranslationDto>> {
		return this.queryBus.execute(
			new TranslationListQuery(permissionContext, params),
		);
	}

	@Get('list-revisions')
	listRevisions(
		@GetPermissionContext() permissionContext: PermissionContext,
		@Query(new JoiValidationPipe(EntryListRevisionsParams.schema))
		params: EntryListRevisionsParams,
	): Promise<SearchResultDto<RevisionDto>> {
		return this.queryBus.execute(
			new TranslationListRevisionsQuery(permissionContext, params),
		);
	}

	@Post('update')
	update(
		@GetPermissionContext() permissionContext: PermissionContext,
		@Body(new JoiValidationPipe(TranslationUpdateParams.schema))
		params: TranslationUpdateParams,
	): Promise<TranslationDto> {
		return this.commandBus.execute(
			new TranslationUpdateCommand(permissionContext, params),
		);
	}
}
