import { Controller, Get, Query } from '@nestjs/common';

import { SearchResultObject } from '../dto/SearchResultObject';
import { TranslationObject } from '../dto/translations/TranslationObject';
import { JoiValidationPipe } from '../pipes/JoiValidationPipe';
import {
	IListTranslationsQuery,
	listTranslationsQuerySchema,
} from '../requests/translations/IListTranslationsQuery';
import { ListTranslationsService } from '../services/translations/ListTranslationsService';

@Controller('translations')
export class TranslationController {
	constructor(
		//private readonly createTranslationService: CreateTranslationService,
		private readonly listTranslationsService: ListTranslationsService,
	) {}

	/*@Post()
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
	}*/

	@Get()
	listTranslations(
		@Query(new JoiValidationPipe(listTranslationsQuerySchema))
		query: IListTranslationsQuery,
	): Promise<SearchResultObject<TranslationObject>> {
		return this.listTranslationsService.listTranslations(query);
	}
}
