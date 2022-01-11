import {
	BadRequestException,
	Body,
	Controller,
	Post,
	Req,
} from '@nestjs/common';
import { Request } from 'express';
import requestIp from 'request-ip';

import { TranslationObject } from '../dto/translations/TranslationObject';
import { JoiValidationPipe } from '../pipes/JoiValidationPipe';
import {
	createTranslationBodySchema,
	ICreateTranslationBody,
} from '../requests/translations/ICreateTranslationBody';
import { CreateTranslationService } from '../services/translations/CreateTranslationService';

@Controller('translations')
export class TranslationController {
	constructor(
		private readonly createTranslationService: CreateTranslationService,
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
			headword: body.headword,
			locale: body.locale,
			reading: body.reading,
			yamatokotoba: body.yamatokotoba,
			category: body.category,
			ip: ip,
		});
	}
}
