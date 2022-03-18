import { EntityRepository, QueryOrder } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';

import { SearchResultObject } from '../../dto/SearchResultObject';
import { RevisionObject } from '../../dto/revisions/RevisionObject';
import { TranslationRevision } from '../../entities/Revision';
import { Translation } from '../../entities/Translation';
import { Permission } from '../../models/Permission';
import { PermissionContext } from '../PermissionContext';

@Injectable()
export class ListTranslationRevisionsService {
	constructor(
		private readonly permissionContext: PermissionContext,
		@InjectRepository(Translation)
		private readonly translationRepo: EntityRepository<Translation>,
		@InjectRepository(TranslationRevision)
		private readonly revisionRepo: EntityRepository<TranslationRevision>,
	) {}

	async listTranslationRevisions(
		translationId: number,
	): Promise<SearchResultObject<RevisionObject>> {
		this.permissionContext.verifyPermission(Permission.ViewEditHistory);

		const translation = await this.translationRepo.findOneOrFail({
			id: translationId,
		});

		this.permissionContext.verifyDeletedAndHidden(translation);

		const revisions = await this.revisionRepo.find(
			{
				translation: translation,
			},
			{
				orderBy: { version: QueryOrder.DESC },
				populate: ['actor'],
				fields: ['createdAt', 'actor', 'event', 'translation'],
			},
		);

		return new SearchResultObject(
			revisions.map(
				(revision) =>
					new RevisionObject(revision, this.permissionContext),
			),
			revisions.length,
		);
	}
}
