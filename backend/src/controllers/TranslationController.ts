import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import {
	EntryDeleteParams,
	TranslationDeleteCommand,
} from '../database/commands/entries/EntryDeleteCommandHandler';
import {
	TranslationUpdateCommand,
	TranslationUpdateParams,
} from '../database/commands/translations/TranslationUpdateCommandHandler';
import {
	EntryListRevisionsParams,
	TranslationListRevisionsQuery,
} from '../database/queries/entries/EntryListRevisionsQueryHandler';
import {
	TranslationGetParams,
	TranslationGetQuery,
} from '../database/queries/translations/TranslationGetQueryHandler';
import {
	TranslationListParams,
	TranslationListQuery,
} from '../database/queries/translations/TranslationListQueryHandler';
import { GetPermissionContext } from '../decorators/GetPermissionContext';
import { RevisionObject } from '../dto/RevisionObject';
import { SearchResultObject } from '../dto/SearchResultObject';
import { TranslationObject } from '../dto/TranslationObject';
import { JoiValidationPipe } from '../pipes/JoiValidationPipe';
import { PermissionContext } from '../services/PermissionContext';

@Controller('translations')
export class TranslationController {
	constructor(
		private readonly queryBus: QueryBus,
		private readonly commandBus: CommandBus,
	) {}

	@Post('create')
	create(
		@GetPermissionContext() permissionContext: PermissionContext,
		@Body(new JoiValidationPipe(TranslationUpdateParams.schema))
		params: TranslationUpdateParams,
	): Promise<TranslationObject> {
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
	): Promise<TranslationObject> {
		return this.queryBus.execute(
			new TranslationGetQuery(permissionContext, params),
		);
	}

	@Get('list')
	list(
		@GetPermissionContext() permissionContext: PermissionContext,
		@Query(new JoiValidationPipe(TranslationListParams.schema))
		params: TranslationListParams,
	): Promise<SearchResultObject<TranslationObject>> {
		return this.queryBus.execute(
			new TranslationListQuery(permissionContext, params),
		);
	}

	@Get('list-revisions')
	listRevisions(
		@GetPermissionContext() permissionContext: PermissionContext,
		@Query(new JoiValidationPipe(EntryListRevisionsParams.schema))
		params: EntryListRevisionsParams,
	): Promise<SearchResultObject<RevisionObject>> {
		return this.queryBus.execute(
			new TranslationListRevisionsQuery(permissionContext, params),
		);
	}

	@Post('update')
	update(
		@GetPermissionContext() permissionContext: PermissionContext,
		@Body(new JoiValidationPipe(TranslationUpdateParams.schema))
		params: TranslationUpdateParams,
	): Promise<TranslationObject> {
		return this.commandBus.execute(
			new TranslationUpdateCommand(permissionContext, params),
		);
	}
}
