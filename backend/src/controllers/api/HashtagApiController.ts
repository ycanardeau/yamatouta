import { HashtagGetQuery } from '@/database/queries/hashtags/HashtagGetQueryHandler';
import { HashtagListQuery } from '@/database/queries/hashtags/HashtagListQueryHandler';
import { HashtagDto } from '@/dto/HashtagDto';
import { SearchResultDto } from '@/dto/SearchResultDto';
import { GetPermissionContext } from '@/framework/decorators/GetPermissionContext';
import { JoiValidationPipe } from '@/framework/pipes/JoiValidationPipe';
import { HashtagGetParams } from '@/models/hashtags/HashtagGetParams';
import { HashtagListParams } from '@/models/hashtags/HashtagListParams';
import { PermissionContext } from '@/services/PermissionContext';
import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

@Controller('api/hashtags')
export class HashtagApiController {
	constructor(private readonly queryBus: QueryBus) {}

	@Get('get')
	get(
		@GetPermissionContext() permissionContext: PermissionContext,
		@Query(new JoiValidationPipe(HashtagGetParams.schema))
		params: HashtagGetParams,
	): Promise<HashtagDto> {
		return this.queryBus.execute(
			new HashtagGetQuery(permissionContext, params),
		);
	}

	@Get('list')
	list(
		@GetPermissionContext() permissionContext: PermissionContext,
		@Query(new JoiValidationPipe(HashtagListParams.schema))
		params: HashtagListParams,
	): Promise<SearchResultDto<HashtagDto>> {
		return this.queryBus.execute(
			new HashtagListQuery(permissionContext, params),
		);
	}
}
