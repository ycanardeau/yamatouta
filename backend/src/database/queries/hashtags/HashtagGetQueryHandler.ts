import { HashtagDto } from '@/dto/HashtagDto';
import { Hashtag } from '@/entities/Hashtag';
import { HashtagGetParams } from '@/models/hashtags/HashtagGetParams';
import { PermissionContext } from '@/services/PermissionContext';
import { whereNotDeleted, whereNotHidden } from '@/services/filters';
import { EntityManager } from '@mikro-orm/core';
import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class HashtagGetQuery {
	constructor(
		readonly permissionContext: PermissionContext,
		readonly params: HashtagGetParams,
	) {}
}

@QueryHandler(HashtagGetQuery)
export class HashtagGetQueryHandler implements IQueryHandler<HashtagGetQuery> {
	constructor(private readonly em: EntityManager) {}

	async execute(query: HashtagGetQuery): Promise<HashtagDto> {
		const { permissionContext, params } = query;

		const hashtag = await this.em.findOne<Hashtag>(Hashtag, {
			name: params.name,
			referenceCount: { $gt: 0 },
			$and: [
				whereNotDeleted(permissionContext),
				whereNotHidden(permissionContext),
			],
		});

		if (!hashtag) throw new NotFoundException();

		return HashtagDto.create(permissionContext, hashtag);
	}
}
