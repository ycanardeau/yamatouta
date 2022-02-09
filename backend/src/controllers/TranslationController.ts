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
import { CreateTranslationService } from '../services/translations/CreateTranslationService';
import { DeleteTranslationService } from '../services/translations/DeleteTranslationService';
import { ListTranslationsService } from '../services/translations/ListTranslationsService';
import { UpdateTranslationService } from '../services/translations/UpdateTranslationService';

@Controller('translations')
export class TranslationController {
	constructor(
		private readonly createTranslationService: CreateTranslationService,
		private readonly listTranslationsService: ListTranslationsService,
		private readonly updateTranslationService: UpdateTranslationService,
		private readonly deleteTranslationService: DeleteTranslationService,
	) {}

	@Post()
	createTranslation(
		@Body(new JoiValidationPipe(updateTranslationBodySchema))
		body: IUpdateTranslationBody,
	): Promise<TranslationObject> {
		return this.createTranslationService.createTranslation(body);
	}

	@Get()
	listTranslations(
		@Query(new JoiValidationPipe(listTranslationsQuerySchema))
		query: IListTranslationsQuery,
	): Promise<SearchResultObject<TranslationObject>> {
		return this.listTranslationsService.listTranslations(query);
	}

	@Patch(':translationId')
	updateTranslation(
		@Param('translationId', ParseIntPipe) translationId: number,
		@Body(new JoiValidationPipe(updateTranslationBodySchema))
		body: IUpdateTranslationBody,
	): Promise<TranslationObject> {
		return this.updateTranslationService.updateTranslation(
			translationId,
			body,
		);
	}

	@Delete(':translationId')
	deleteTranslation(
		@Param('translationId', ParseIntPipe) translationId: number,
	): Promise<void> {
		return this.deleteTranslationService.deleteTranslation(translationId);
	}
}
