import { renderReact } from '@/controllers/renderReact';
import { QuoteGetQuery } from '@/database/queries/quotes/QuoteGetQueryHandler';
import { QuoteObject } from '@/dto/QuoteObject';
import { GetPermissionContext } from '@/framework/decorators/GetPermissionContext';
import { QuoteGetParams } from '@/models/quotes/QuoteGetParams';
import { PermissionContext } from '@/services/PermissionContext';
import { Controller, Get, Param, ParseIntPipe, Res } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Response } from 'express';
import { t } from 'i18next';

@Controller('quotes')
export class QuoteController {
	constructor(private readonly queryBus: QueryBus) {}

	@Get('')
	index(@Res() response: Response): void {
		return renderReact(response, {
			title: t('shared.quotes'),
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
		const quote = await this.queryBus.execute<QuoteGetQuery, QuoteObject>(
			new QuoteGetQuery(permissionContext, new QuoteGetParams(id)),
		);

		// TODO: Use replaceAll.
		const quotePlainText = quote.plainText.replace(/\n/g, '');

		return renderReact(response, {
			title: `${t('shared.quote')} "${quotePlainText}" by ${
				quote.artist.name
			}`,
		});
	}
}
