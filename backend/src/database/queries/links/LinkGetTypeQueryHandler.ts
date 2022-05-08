import { EntityManager } from '@mikro-orm/core';
import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { LinkTypeObject } from '../../../dto/LinkTypeObject';
import { LinkType } from '../../../entities/LinkType';
import { LinkGetTypeParams } from '../../../models/links/LinkGetTypeParams';

export class LinkGetTypeQuery {
	constructor(readonly params: LinkGetTypeParams) {}
}

@QueryHandler(LinkGetTypeQuery)
export class LinkGetTypeQueryHandler
	implements IQueryHandler<LinkGetTypeQuery>
{
	constructor(private readonly em: EntityManager) {}

	async execute(query: LinkGetTypeQuery): Promise<LinkTypeObject> {
		const { params } = query;

		const linkType = await this.em.findOne(LinkType, {
			id: params.id,
		});

		if (!linkType) throw new NotFoundException();

		return new LinkTypeObject(linkType);
	}
}
