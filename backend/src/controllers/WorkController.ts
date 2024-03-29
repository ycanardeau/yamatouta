import { renderReact } from '@/controllers/renderReact';
import { WorkGetQuery } from '@/database/queries/works/WorkGetQueryHandler';
import { WorkDto } from '@/dto/WorkDto';
import { GetPermissionContext } from '@/framework/decorators/GetPermissionContext';
import { WorkGetParams } from '@/models/works/WorkGetParams';
import { PermissionContext } from '@/services/PermissionContext';
import { Controller, Get, Param, ParseIntPipe, Res } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Response } from 'express';
import { t } from 'i18next';

@Controller('works')
export class WorkController {
	constructor(private readonly queryBus: QueryBus) {}

	@Get('')
	index(@Res() response: Response): void {
		return renderReact(response, {
			title: t('shared.works'),
		});
	}

	@Get('create')
	create(@Res() response: Response): void {
		return renderReact(response);
	}

	@Get(':id/quotes')
	async quotes(
		@GetPermissionContext() permissionContext: PermissionContext,
		@Param('id', ParseIntPipe) id: number,
		@Res() response: Response,
	): Promise<void> {
		const work = await this.queryBus.execute<WorkGetQuery, WorkDto>(
			new WorkGetQuery(permissionContext, new WorkGetParams(id)),
		);

		return renderReact(response, {
			title: `${t('shared.work')} "${work.name}" - ${t('shared.quotes')}`,
		});
	}

	@Get(':id')
	async details(
		@GetPermissionContext() permissionContext: PermissionContext,
		@Param('id', ParseIntPipe) id: number,
		@Res() response: Response,
	): Promise<void> {
		const work = await this.queryBus.execute<WorkGetQuery, WorkDto>(
			new WorkGetQuery(permissionContext, new WorkGetParams(id)),
		);

		return renderReact(response, {
			title: `${t('shared.work')} "${work.name}"`,
		});
	}
}
