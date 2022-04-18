import { EntityRepository, QueryOrder } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';

import { SearchResultObject } from '../../../dto/SearchResultObject';
import { RevisionObject } from '../../../dto/revisions/RevisionObject';
import { Artist } from '../../../entities/Artist';
import { Quote } from '../../../entities/Quote';
import { Translation } from '../../../entities/Translation';
import { Work } from '../../../entities/Work';
import { Entry } from '../../../models/Entry';
import { Permission } from '../../../models/Permission';
import { PermissionContext } from '../../PermissionContext';
import { whereNotDeleted, whereNotHidden } from '../../filters';

abstract class ListEntryRevisionsQueryHandler<TEntry extends Entry> {
	constructor(
		private readonly permissionContext: PermissionContext,
		private readonly entryFunc: (entryId: number) => Promise<TEntry>,
	) {}

	async execute(
		entryId: number,
	): Promise<SearchResultObject<RevisionObject>> {
		this.permissionContext.verifyPermission(Permission.ViewEditHistory);

		const entry = await this.entryFunc(entryId);

		this.permissionContext.verifyDeletedAndHidden(entry);

		const revisions = await entry.revisions.matching({
			where: {
				$and: [
					whereNotDeleted(this.permissionContext),
					whereNotHidden(this.permissionContext),
				],
			},
			orderBy: { version: QueryOrder.DESC },
			populate: ['actor'],
		});

		return new SearchResultObject(
			revisions.map(
				(revision) =>
					new RevisionObject(revision, this.permissionContext),
			),
			revisions.length,
		);
	}
}

@Injectable()
export class ListTranslationRevisionsQueryHandler extends ListEntryRevisionsQueryHandler<Translation> {
	constructor(
		permissionContext: PermissionContext,
		@InjectRepository(Translation)
		translationRepo: EntityRepository<Translation>,
	) {
		super(permissionContext, (entryId) =>
			translationRepo.findOneOrFail({ id: entryId }),
		);
	}
}

@Injectable()
export class ListArtistRevisionsQueryHandler extends ListEntryRevisionsQueryHandler<Artist> {
	constructor(
		permissionContext: PermissionContext,
		@InjectRepository(Artist)
		artistRepo: EntityRepository<Artist>,
	) {
		super(permissionContext, (entryId) =>
			artistRepo.findOneOrFail({ id: entryId }),
		);
	}
}

@Injectable()
export class ListQuoteRevisionsQueryHandler extends ListEntryRevisionsQueryHandler<Quote> {
	constructor(
		permissionContext: PermissionContext,
		@InjectRepository(Quote)
		quoteRepo: EntityRepository<Quote>,
	) {
		super(permissionContext, (entryId) =>
			quoteRepo.findOneOrFail({ id: entryId }),
		);
	}
}

@Injectable()
export class ListWorkRevisionsQueryHandler extends ListEntryRevisionsQueryHandler<Work> {
	constructor(
		permissionContext: PermissionContext,
		@InjectRepository(Work)
		workRepo: EntityRepository<Work>,
	) {
		super(permissionContext, (entryId) =>
			workRepo.findOneOrFail({ id: entryId }),
		);
	}
}
