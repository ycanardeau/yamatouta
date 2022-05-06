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

import { DeleteTranslationCommand } from '../database/commands/entries/DeleteEntryCommandHandler';
import { CreateTranslationCommand } from '../database/commands/translations/CreateTranslationCommandHandler';
import {
	UpdateTranslationCommand,
	UpdateTranslationParams,
} from '../database/commands/translations/UpdateTranslationCommandHandler';
import { ListTranslationRevisionsQuery } from '../database/queries/entries/ListEntryRevisionsQueryHandler';
import {
	GetTranslationParams,
	GetTranslationQuery,
} from '../database/queries/translations/GetTranslationQueryHandler';
import {
	ListTranslationsParams,
	ListTranslationsQuery,
} from '../database/queries/translations/ListTranslationsQueryHandler';
import { GetPermissionContext } from '../decorators/GetPermissionContext';
import { SearchResultObject } from '../dto/SearchResultObject';
import { RevisionObject } from '../dto/revisions/RevisionObject';
import { TranslationObject } from '../dto/translations/TranslationObject';
import { JoiValidationPipe } from '../pipes/JoiValidationPipe';
import { PermissionContext } from '../services/PermissionContext';

@Controller('translations')
export class TranslationController {
	constructor(
		private readonly queryBus: QueryBus,
		private readonly commandBus: CommandBus,
	) {}

	@Post()
	createTranslation(
		@GetPermissionContext() permissionContext: PermissionContext,
		@Body(new JoiValidationPipe(UpdateTranslationParams.schema))
		params: UpdateTranslationParams,
	): Promise<TranslationObject> {
		return this.commandBus.execute(
			new CreateTranslationCommand(permissionContext, params),
		);
	}

	@Get()
	listTranslations(
		@GetPermissionContext() permissionContext: PermissionContext,
		@Query(new JoiValidationPipe(ListTranslationsParams.schema))
		params: ListTranslationsParams,
	): Promise<SearchResultObject<TranslationObject>> {
		return this.queryBus.execute(
			new ListTranslationsQuery(permissionContext, params),
		);
	}

	@Patch(':translationId')
	updateTranslation(
		@GetPermissionContext() permissionContext: PermissionContext,
		@Param('translationId', ParseIntPipe) translationId: number,
		@Body(new JoiValidationPipe(UpdateTranslationParams.schema))
		params: UpdateTranslationParams,
	): Promise<TranslationObject> {
		return this.commandBus.execute(
			new UpdateTranslationCommand(permissionContext, {
				...params,
				translationId,
			}),
		);
	}

	@Delete(':translationId')
	deleteTranslation(
		@GetPermissionContext() permissionContext: PermissionContext,
		@Param('translationId', ParseIntPipe) translationId: number,
	): Promise<void> {
		return this.commandBus.execute(
			new DeleteTranslationCommand(permissionContext, {
				entryId: translationId,
			}),
		);
	}

	@Get(':translationId')
	getTranslation(
		@GetPermissionContext() permissionContext: PermissionContext,
		@Param('translationId', ParseIntPipe) translationId: number,
		@Query(new JoiValidationPipe(GetTranslationParams.schema))
		params: GetTranslationParams,
	): Promise<TranslationObject> {
		return this.queryBus.execute(
			new GetTranslationQuery(permissionContext, {
				...params,
				translationId,
			}),
		);
	}

	@Get(':translationId/revisions')
	listTranslationRevisions(
		@GetPermissionContext() permissionContext: PermissionContext,
		@Param('translationId', ParseIntPipe) translationId: number,
	): Promise<SearchResultObject<RevisionObject>> {
		return this.queryBus.execute(
			new ListTranslationRevisionsQuery(permissionContext, {
				entryId: translationId,
			}),
		);
	}
}
