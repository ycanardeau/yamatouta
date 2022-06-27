import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

import { HashtagGetQuery } from '../../database/queries/hashtags/HashtagGetQueryHandler';
import { HashtagObject } from '../../dto/HashtagObject';
import { GetPermissionContext } from '../../framework/decorators/GetPermissionContext';
import { JoiValidationPipe } from '../../framework/pipes/JoiValidationPipe';
import { HashtagGetParams } from '../../models/hashtags/HashtagGetParams';
import { PermissionContext } from '../../services/PermissionContext';

@Controller('api/hashtags')
export class HashtagApiController {
	constructor(private readonly queryBus: QueryBus) {}

	@Get('get')
	get(
		@GetPermissionContext() permissionContext: PermissionContext,
		@Query(new JoiValidationPipe(HashtagGetParams.schema))
		params: HashtagGetParams,
	): Promise<HashtagObject> {
		return this.queryBus.execute(
			new HashtagGetQuery(permissionContext, params),
		);
	}
}
