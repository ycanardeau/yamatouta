import {
	BadRequestException,
	Body,
	Controller,
	Get,
	Post,
	Query,
	Req,
} from '@nestjs/common';
import { Request } from 'express';
import requestIp from 'request-ip';

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
		@Req() request: Request,
	): Promise<TranslationObject> {
		const ip = requestIp.getClientIp(request);

		if (!ip) throw new BadRequestException('IP address cannot be found.');

		return this.createTranslationService.createTranslation({
			...body,
			ip: ip,
		});
	}

	@Get()
	listTranslations(
		@Query(new JoiValidationPipe(listTranslationsQuerySchema))
		query: IListTranslationsQuery,
	): Promise<SearchResultObject<TranslationObject>> {
		return this.listTranslationsService.listTranslations(query);
	}
}
