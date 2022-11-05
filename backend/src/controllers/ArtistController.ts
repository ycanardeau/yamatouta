import { renderReact } from '@/controllers/renderReact';
import { ArtistGetQuery } from '@/database/queries/artists/ArtistGetQueryHandler';
import { ArtistDto } from '@/dto/ArtistDto';
import { GetPermissionContext } from '@/framework/decorators/GetPermissionContext';
import { ArtistGetParams } from '@/models/artists/ArtistGetParams';
import { PermissionContext } from '@/services/PermissionContext';
import { Controller, Get, Param, ParseIntPipe, Res } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Response } from 'express';
import { t } from 'i18next';

@Controller('artists')
export class ArtistController {
	constructor(private readonly queryBus: QueryBus) {}

	@Get('')
	index(@Res() response: Response): void {
		return renderReact(response, {
			title: t('shared.artists'),
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
		const artist = await this.queryBus.execute<ArtistGetQuery, ArtistDto>(
			new ArtistGetQuery(permissionContext, new ArtistGetParams(id)),
		);

		return renderReact(response, {
			title: `${t('shared.artist')} "${artist.name}" - ${t(
				'shared.quotes',
			)}`,
		});
	}

	@Get(':id')
	async details(
		@GetPermissionContext() permissionContext: PermissionContext,
		@Param('id', ParseIntPipe) id: number,
		@Res() response: Response,
	): Promise<void> {
		const artist = await this.queryBus.execute<ArtistGetQuery, ArtistDto>(
			new ArtistGetQuery(permissionContext, new ArtistGetParams(id)),
		);

		return renderReact(response, {
			title: `${t('shared.artist')} "${artist.name}"`,
		});
	}
}
