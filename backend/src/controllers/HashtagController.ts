import { renderReact } from '@/controllers/renderReact';
import { HashtagGetQuery } from '@/database/queries/hashtags/HashtagGetQueryHandler';
import { HashtagObject } from '@/dto/HashtagObject';
import { GetPermissionContext } from '@/framework/decorators/GetPermissionContext';
import { HashtagGetParams } from '@/models/hashtags/HashtagGetParams';
import { PermissionContext } from '@/services/PermissionContext';
import { Controller, Get, Param, Res } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Response } from 'express';
import { t } from 'i18next';

@Controller('hashtags')
export class HashtagController {
	constructor(private readonly queryBus: QueryBus) {}

	@Get('')
	index(@Res() response: Response): void {
		return renderReact(response, {
			title: t('shared.hashtags'),
		});
	}

	@Get(':name/quotes')
	async quotes(
		@GetPermissionContext() permissionContext: PermissionContext,
		@Param('name') name: string,
		@Res() response: Response,
	): Promise<void> {
		const hashtag = await this.queryBus.execute<
			HashtagGetQuery,
			HashtagObject
		>(new HashtagGetQuery(permissionContext, new HashtagGetParams(name)));

		return renderReact(response, {
			title: `${t('shared.hashtag')} "#${hashtag.name}" - ${t(
				'shared.quotes',
			)}`,
		});
	}

	@Get(':name')
	async details(
		@GetPermissionContext() permissionContext: PermissionContext,
		@Param('name') name: string,
		@Res() response: Response,
	): Promise<void> {
		const hashtag = await this.queryBus.execute<
			HashtagGetQuery,
			HashtagObject
		>(new HashtagGetQuery(permissionContext, new HashtagGetParams(name)));

		return renderReact(response, {
			title: `${t('shared.hashtag')} "#${hashtag.name}"`,
		});
	}
}
