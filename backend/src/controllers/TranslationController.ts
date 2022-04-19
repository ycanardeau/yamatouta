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

import { DeleteTranslationCommand } from '../database/commands/entries/DeleteEntryCommandHandler';
import { CreateTranslationCommand } from '../database/commands/translations/CreateTranslationCommandHandler';
import { UpdateTranslationCommand } from '../database/commands/translations/UpdateTranslationCommandHandler';
import { ListTranslationRevisionsQuery } from '../database/queries/entries/ListEntryRevisionsQueryHandler';
import { GetTranslationQuery } from '../database/queries/translations/GetTranslationQueryHandler';
import { ListTranslationsQuery } from '../database/queries/translations/ListTranslationsQueryHandler';
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
		@Req() request: Request,
		@Body(new JoiValidationPipe(UpdateTranslationCommand.schema))
		command: UpdateTranslationCommand,
	): Promise<TranslationObject> {
		return this.commandBus.execute(
			new CreateTranslationCommand(
				new PermissionContext(request),
				command.translationId,
				command.headword,
				command.locale,
				command.reading,
				command.yamatokotoba,
				command.category,
			),
		);
	}

	@Get()
	listTranslations(
		@Req() request: Request,
		@Query(new JoiValidationPipe(ListTranslationsQuery.schema))
		query: ListTranslationsQuery,
	): Promise<SearchResultObject<TranslationObject>> {
		return this.queryBus.execute(
			new ListTranslationsQuery(
				new PermissionContext(request),
				query.sort,
				query.offset,
				query.limit,
				query.getTotalCount,
				query.query,
				query.category,
			),
		);
	}

	@Patch(':translationId')
	updateTranslation(
		@Req() request: Request,
		@Param('translationId', ParseIntPipe) translationId: number,
		@Body(new JoiValidationPipe(UpdateTranslationCommand.schema))
		command: UpdateTranslationCommand,
	): Promise<TranslationObject> {
		return this.commandBus.execute(
			new UpdateTranslationCommand(
				new PermissionContext(request),
				translationId,
				command.headword,
				command.locale,
				command.reading,
				command.yamatokotoba,
				command.category,
			),
		);
	}

	@Delete(':translationId')
	deleteTranslation(
		@Req() request: Request,
		@Param('translationId', ParseIntPipe) translationId: number,
	): Promise<void> {
		return this.commandBus.execute(
			new DeleteTranslationCommand(
				new PermissionContext(request),
				translationId,
			),
		);
	}

	@Get(':translationId')
	getTranslation(
		@Req() request: Request,
		@Param('translationId', ParseIntPipe) translationId: number,
	): Promise<TranslationObject> {
		return this.queryBus.execute(
			new GetTranslationQuery(
				new PermissionContext(request),
				translationId,
			),
		);
	}

	@Get(':translationId/revisions')
	listTranslationRevisions(
		@Req() request: Request,
		@Param('translationId', ParseIntPipe) translationId: number,
	): Promise<SearchResultObject<RevisionObject>> {
		return this.queryBus.execute(
			new ListTranslationRevisionsQuery(
				new PermissionContext(request),
				translationId,
			),
		);
	}
}
