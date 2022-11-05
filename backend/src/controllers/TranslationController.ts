import { renderReact } from '@/controllers/renderReact';
import { TranslationGetQuery } from '@/database/queries/translations/TranslationGetQueryHandler';
import { TranslationObject } from '@/dto/TranslationObject';
import { GetPermissionContext } from '@/framework/decorators/GetPermissionContext';
import { TranslationGetParams } from '@/models/translations/TranslationGetParams';
import { PermissionContext } from '@/services/PermissionContext';
import { Controller, Get, Param, ParseIntPipe, Res } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Response } from 'express';
import { t } from 'i18next';

@Controller('translations')
export class TranslationController {
	constructor(private readonly queryBus: QueryBus) {}

	@Get('')
	index(@Res() response: Response): void {
		return renderReact(response, {
			title: t('shared.words'),
		});
	}

	@Get('create')
	create(@Res() response: Response): void {
		return renderReact(response);
	}

	@Get(':id*')
	async details(
		@GetPermissionContext() permissionContext: PermissionContext,
		@Param('id', ParseIntPipe) id: number,
		@Res() response: Response,
	): Promise<void> {
		const translation = await this.queryBus.execute<
			TranslationGetQuery,
			TranslationObject
		>(
			new TranslationGetQuery(
				permissionContext,
				new TranslationGetParams(id),
			),
		);

		return renderReact(response, {
			title: `${t('shared.word')} "${translation.headword} ↔ ${
				translation.yamatokotoba
			}"`,
		});
	}
}
