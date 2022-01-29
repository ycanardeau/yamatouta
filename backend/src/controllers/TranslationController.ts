import { Body, Controller, Get, Post, Query } from '@nestjs/common';

import { SearchResultObject } from '../dto/SearchResultObject';
import { TranslationObject } from '../dto/translations/TranslationObject';
import { JoiValidationPipe } from '../pipes/JoiValidationPipe';
import {
	createTranslationBodySchema,
	ICreateTranslationBody,
} from '../requests/translations/ICreateTranslationBody';
import {
	IListTranslationsQuery,
	listTranslationsQuerySchema,
} from '../requests/translations/IListTranslationsQuery';
import { CreateTranslationService } from '../services/translations/CreateTranslationService';
import { ListTranslationsService } from '../services/translations/ListTranslationsService';

@Controller('translations')
export class TranslationController {
	constructor(
		private readonly createTranslationService: CreateTranslationService,
		private readonly listTranslationsService: ListTranslationsService,
	) {}

	@Post()
	createTranslation(
		@Body(new JoiValidationPipe(createTranslationBodySchema))
		body: ICreateTranslationBody,
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
}
