import { EntityRepository, QueryOrder } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';

import { SearchResultObject } from '../../../dto/SearchResultObject';
import { RevisionObject } from '../../../dto/revisions/RevisionObject';
import { Artist } from '../../../entities/Artist';
import { Quote } from '../../../entities/Quote';
import { Translation } from '../../../entities/Translation';
import { Work } from '../../../entities/Work';
import { Entry } from '../../../models/Entry';
import { Permission } from '../../../models/Permission';
import { PermissionContext } from '../../../services/PermissionContext';
import { whereNotDeleted, whereNotHidden } from '../../../services/filters';
import { IQueryHandler, QueryHandler } from '../IQueryHandler';

export abstract class ListEntryRevisionsQuery {
	constructor(readonly entryId: number) {}
}

abstract class ListEntryRevisionsQueryHandler<
	TEntry extends Entry,
	TQuery extends ListEntryRevisionsQuery,
> {
	constructor(
		private readonly permissionContext: PermissionContext,
		private readonly entryFunc: (entryId: number) => Promise<TEntry>,
	) {}

	async execute(query: TQuery): Promise<SearchResultObject<RevisionObject>> {
		this.permissionContext.verifyPermission(Permission.ViewEditHistory);

		const entry = await this.entryFunc(query.entryId);

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

export class ListTranslationRevisionsQuery extends ListEntryRevisionsQuery {}

@QueryHandler(ListTranslationRevisionsQuery)
export class ListTranslationRevisionsQueryHandler
	extends ListEntryRevisionsQueryHandler<
		Translation,
		ListTranslationRevisionsQuery
	>
	implements IQueryHandler<ListTranslationRevisionsQuery>
{
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

export class ListArtistRevisionsQuery extends ListEntryRevisionsQuery {}

@QueryHandler(ListArtistRevisionsQuery)
export class ListArtistRevisionsQueryHandler
	extends ListEntryRevisionsQueryHandler<Artist, ListArtistRevisionsQuery>
	implements IQueryHandler<ListArtistRevisionsQuery>
{
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

export class ListQuoteRevisionsQuery extends ListEntryRevisionsQuery {}

@QueryHandler(ListQuoteRevisionsQuery)
export class ListQuoteRevisionsQueryHandler
	extends ListEntryRevisionsQueryHandler<Quote, ListQuoteRevisionsQuery>
	implements IQueryHandler<ListQuoteRevisionsQuery>
{
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

export class ListWorkRevisionsQuery extends ListEntryRevisionsQuery {}

@QueryHandler(ListWorkRevisionsQuery)
export class ListWorkRevisionsQueryHandler
	extends ListEntryRevisionsQueryHandler<Work, ListWorkRevisionsQuery>
	implements IQueryHandler<ListWorkRevisionsQuery>
{
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
