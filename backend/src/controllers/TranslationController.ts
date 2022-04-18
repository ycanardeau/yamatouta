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
import { RevisionObject } from '../dto/revisions/RevisionObject';
import { TranslationObject } from '../dto/translations/TranslationObject';
import { JoiValidationPipe } from '../pipes/JoiValidationPipe';
import {
	IListTranslationsQuery,
	listTranslationsQuerySchema,
} from '../requests/translations/IListTranslationsQuery';
import { DeleteTranslationCommandHandler } from '../services/commands/entries/DeleteEntryCommandHandler';
import { CreateTranslationCommandHandler } from '../services/commands/translations/CreateTranslationCommandHandler';
import {
	UpdateTranslationCommand,
	UpdateTranslationCommandHandler,
} from '../services/commands/translations/UpdateTranslationCommandHandler';
import { ListTranslationRevisionsQueryHandler } from '../services/queries/entries/ListEntryRevisionsQueryHandler';
import { GetTranslationQueryHandler } from '../services/queries/translations/GetTranslationQueryHandler';
import { ListTranslationsQueryHandler } from '../services/queries/translations/ListTranslationsQueryHandler';

@Controller('translations')
export class TranslationController {
	constructor(
		private readonly createTranslationCommandHandler: CreateTranslationCommandHandler,
		private readonly listTranslationsQueryHandler: ListTranslationsQueryHandler,
		private readonly updateTranslationCommandHandler: UpdateTranslationCommandHandler,
		private readonly deleteTranslationCommandHandler: DeleteTranslationCommandHandler,
		private readonly getTranslationQueryHandler: GetTranslationQueryHandler,
		private readonly listTranslationRevisionsQueryHandler: ListTranslationRevisionsQueryHandler,
	) {}

	@Post()
	createTranslation(
		@Body(new JoiValidationPipe(UpdateTranslationCommand.schema))
		command: UpdateTranslationCommand,
	): Promise<TranslationObject> {
		return this.createTranslationCommandHandler.execute(command);
	}

	@Get()
	listTranslations(
		@Query(new JoiValidationPipe(listTranslationsQuerySchema))
		query: IListTranslationsQuery,
	): Promise<SearchResultObject<TranslationObject>> {
		return this.listTranslationsQueryHandler.execute(query);
	}

	@Patch(':translationId')
	updateTranslation(
		@Param('translationId', ParseIntPipe) translationId: number,
		@Body(new JoiValidationPipe(UpdateTranslationCommand.schema))
		command: UpdateTranslationCommand,
	): Promise<TranslationObject> {
		return this.updateTranslationCommandHandler.execute(
			translationId,
			command,
		);
	}

	@Delete(':translationId')
	deleteTranslation(
		@Param('translationId', ParseIntPipe) translationId: number,
	): Promise<void> {
		return this.deleteTranslationCommandHandler.execute({
			entryId: translationId,
		});
	}

	@Get(':translationId')
	getTranslation(
		@Param('translationId', ParseIntPipe) translationId: number,
	): Promise<TranslationObject> {
		return this.getTranslationQueryHandler.execute(translationId);
	}

	@Get(':translationId/revisions')
	listTranslationRevisions(
		@Param('translationId', ParseIntPipe) translationId: number,
	): Promise<SearchResultObject<RevisionObject>> {
		return this.listTranslationRevisionsQueryHandler.execute(translationId);
	}
}
