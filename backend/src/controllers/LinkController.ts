import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

import { LinkGetTypeQuery } from '../database/queries/links/LinkGetTypeQueryHandler';
import { LinkListTypesQuery } from '../database/queries/links/LinkListTypesQueryHandler';
import { LinkTypeObject } from '../dto/LinkTypeObject';
import { SearchResultObject } from '../dto/SearchResultObject';
import { LinkGetTypeParams } from '../models/links/LinkGetTypeParams';
import { LinkListTypesParams } from '../models/links/LinkListTypesParams';
import { JoiValidationPipe } from '../pipes/JoiValidationPipe';

@Controller('links')
export class LinkController {
	constructor(private readonly queryBus: QueryBus) {}

	@Get('get-type')
	getType(
		@Query(new JoiValidationPipe(LinkGetTypeParams.schema))
		params: LinkGetTypeParams,
	): Promise<LinkTypeObject> {
		return this.queryBus.execute(new LinkGetTypeQuery(params));
	}

	@Get('list-types')
	async listTypes(
		@Query(new JoiValidationPipe(LinkListTypesParams.schema))
		params: LinkListTypesParams,
	): Promise<SearchResultObject<LinkTypeObject>> {
		return this.queryBus.execute(new LinkListTypesQuery(params));
	}
}
