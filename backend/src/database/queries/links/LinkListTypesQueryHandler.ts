import { EntityManager, FilterQuery } from '@mikro-orm/core';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { LinkTypeObject } from '../../../dto/LinkTypeObject';
import { SearchResultObject } from '../../../dto/SearchResultObject';
import { LinkType } from '../../../entities/LinkType';
import { LinkListTypesParams } from '../../../models/links/LinkListTypesParams';

export class LinkListTypesQuery {
	constructor(readonly params: LinkListTypesParams) {}
}

@QueryHandler(LinkListTypesQuery)
export class LinkListTypesQueryHandler
	implements IQueryHandler<LinkListTypesQuery>
{
	constructor(private readonly em: EntityManager) {}

	async execute(
		query: LinkListTypesQuery,
	): Promise<SearchResultObject<LinkTypeObject>> {
		const { params } = query;

		const where: FilterQuery<LinkType> = {
			$and: [
				params.entryType ? { entryType: params.entryType } : {},
				params.relatedEntryType
					? { relatedEntryType: params.relatedEntryType }
					: {},
			],
		};

		const [linkTypes, count] = await this.em.findAndCount(LinkType, where);

		return new SearchResultObject<LinkTypeObject>(
			linkTypes.map((linkType) => new LinkTypeObject(linkType)),
			count,
		);
	}
}
