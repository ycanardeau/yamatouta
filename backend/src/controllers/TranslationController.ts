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
import {
	updateTranslationBodySchema,
	IUpdateTranslationBody,
} from '../requests/translations/IUpdateTranslationBody';
import { DeleteTranslationService } from '../services/entries/DeleteEntryService';
import { ListTranslationRevisionsService } from '../services/entries/ListEntryRevisionsService';
import { CreateTranslationService } from '../services/translations/CreateTranslationService';
import { GetTranslationService } from '../services/translations/GetTranslationService';
import { ListTranslationsService } from '../services/translations/ListTranslationsService';
import { UpdateTranslationService } from '../services/translations/UpdateTranslationService';

@Controller('translations')
export class TranslationController {
	constructor(
		private readonly createTranslationService: CreateTranslationService,
		private readonly listTranslationsService: ListTranslationsService,
		private readonly updateTranslationService: UpdateTranslationService,
		private readonly deleteTranslationService: DeleteTranslationService,
		private readonly getTranslationService: GetTranslationService,
		private readonly listTranslationRevisionsService: ListTranslationRevisionsService,
	) {}

	@Post()
	createTranslation(
		@Body(new JoiValidationPipe(updateTranslationBodySchema))
		body: IUpdateTranslationBody,
	): Promise<TranslationObject> {
		return this.createTranslationService.execute(body);
	}

	@Get()
	listTranslations(
		@Query(new JoiValidationPipe(listTranslationsQuerySchema))
		query: IListTranslationsQuery,
	): Promise<SearchResultObject<TranslationObject>> {
		return this.listTranslationsService.execute(query);
	}

	@Patch(':translationId')
	updateTranslation(
		@Param('translationId', ParseIntPipe) translationId: number,
		@Body(new JoiValidationPipe(updateTranslationBodySchema))
		body: IUpdateTranslationBody,
	): Promise<TranslationObject> {
		return this.updateTranslationService.execute(translationId, body);
	}

	@Delete(':translationId')
	deleteTranslation(
		@Param('translationId', ParseIntPipe) translationId: number,
	): Promise<void> {
		return this.deleteTranslationService.execute(translationId);
	}

	@Get(':translationId')
	getTranslation(
		@Param('translationId', ParseIntPipe) translationId: number,
	): Promise<TranslationObject> {
		return this.getTranslationService.execute(translationId);
	}

	@Get(':translationId/revisions')
	listTranslationRevisions(
		@Param('translationId', ParseIntPipe) translationId: number,
	): Promise<SearchResultObject<RevisionObject>> {
		return this.listTranslationRevisionsService.execute(translationId);
	}
}
