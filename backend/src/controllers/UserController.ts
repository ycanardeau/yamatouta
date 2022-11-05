import { renderReact } from '@/controllers/renderReact';
import { UserGetQuery } from '@/database/queries/users/UserGetQueryHandler';
import { UserObject } from '@/dto/UserObject';
import { GetPermissionContext } from '@/framework/decorators/GetPermissionContext';
import { UserGetParams } from '@/models/users/UserGetParams';
import { PermissionContext } from '@/services/PermissionContext';
import { Controller, Get, Param, ParseIntPipe, Res } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Response } from 'express';
import { t } from 'i18next';

@Controller('users')
export class UserController {
	constructor(private readonly queryBus: QueryBus) {}

	@Get('')
	index(@Res() response: Response): void {
		return renderReact(response, {
			title: t('shared.users'),
		});
	}

	@Get(':id*')
	async details(
		@GetPermissionContext() permissionContext: PermissionContext,
		@Param('id', ParseIntPipe) id: number,
		@Res() response: Response,
	): Promise<void> {
		const user = await this.queryBus.execute<UserGetQuery, UserObject>(
			new UserGetQuery(permissionContext, new UserGetParams(id)),
		);

		return renderReact(response, {
			title: `${t('shared.user')} "${user.name}"`,
		});
	}
}
