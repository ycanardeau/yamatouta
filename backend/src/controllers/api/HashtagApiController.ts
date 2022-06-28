import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

import { HashtagGetQuery } from '../../database/queries/hashtags/HashtagGetQueryHandler';
import { HashtagListQuery } from '../../database/queries/hashtags/HashtagListQueryHandler';
import { HashtagObject } from '../../dto/HashtagObject';
import { SearchResultObject } from '../../dto/SearchResultObject';
import { GetPermissionContext } from '../../framework/decorators/GetPermissionContext';
import { JoiValidationPipe } from '../../framework/pipes/JoiValidationPipe';
import { HashtagGetParams } from '../../models/hashtags/HashtagGetParams';
import { HashtagListParams } from '../../models/hashtags/HashtagListParams';
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

	@Get('list')
	list(
		@GetPermissionContext() permissionContext: PermissionContext,
		@Query(new JoiValidationPipe(HashtagListParams.schema))
		params: HashtagListParams,
	): Promise<SearchResultObject<HashtagObject>> {
		return this.queryBus.execute(
			new HashtagListQuery(permissionContext, params),
		);
	}
}
