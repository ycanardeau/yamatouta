import { EntityRepository, QueryOrder } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

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

export class ListEntryRevisionsParams {
	constructor(readonly entryId: number) {}
}

export abstract class ListEntryRevisionsQuery {
	constructor(
		readonly permissionContext: PermissionContext,
		readonly params: ListEntryRevisionsParams,
	) {}
}

abstract class ListEntryRevisionsQueryHandler<
	TEntry extends Entry,
	TQuery extends ListEntryRevisionsQuery,
> {
	constructor(
		private readonly entryFunc: (entryId: number) => Promise<TEntry>,
	) {}

	async execute(query: TQuery): Promise<SearchResultObject<RevisionObject>> {
		const { permissionContext, params } = query;

		permissionContext.verifyPermission(Permission.ViewEditHistory);

		const entry = await this.entryFunc(params.entryId);

		permissionContext.verifyDeletedAndHidden(entry);

		const revisions = await entry.revisions.matching({
			where: {
				$and: [
					whereNotDeleted(permissionContext),
					whereNotHidden(permissionContext),
				],
			},
			orderBy: { version: QueryOrder.DESC },
			populate: ['actor'],
		});

		return new SearchResultObject(
			revisions.map(
				(revision) => new RevisionObject(revision, permissionContext),
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
		@InjectRepository(Translation)
		translationRepo: EntityRepository<Translation>,
	) {
		super((entryId) => translationRepo.findOneOrFail({ id: entryId }));
	}
}

export class ListArtistRevisionsQuery extends ListEntryRevisionsQuery {}

@QueryHandler(ListArtistRevisionsQuery)
export class ListArtistRevisionsQueryHandler
	extends ListEntryRevisionsQueryHandler<Artist, ListArtistRevisionsQuery>
	implements IQueryHandler<ListArtistRevisionsQuery>
{
	constructor(
		@InjectRepository(Artist)
		artistRepo: EntityRepository<Artist>,
	) {
		super((entryId) => artistRepo.findOneOrFail({ id: entryId }));
	}
}

export class ListQuoteRevisionsQuery extends ListEntryRevisionsQuery {}

@QueryHandler(ListQuoteRevisionsQuery)
export class ListQuoteRevisionsQueryHandler
	extends ListEntryRevisionsQueryHandler<Quote, ListQuoteRevisionsQuery>
	implements IQueryHandler<ListQuoteRevisionsQuery>
{
	constructor(
		@InjectRepository(Quote)
		quoteRepo: EntityRepository<Quote>,
	) {
		super((entryId) => quoteRepo.findOneOrFail({ id: entryId }));
	}
}

export class ListWorkRevisionsQuery extends ListEntryRevisionsQuery {}

@QueryHandler(ListWorkRevisionsQuery)
export class ListWorkRevisionsQueryHandler
	extends ListEntryRevisionsQueryHandler<Work, ListWorkRevisionsQuery>
	implements IQueryHandler<ListWorkRevisionsQuery>
{
	constructor(
		@InjectRepository(Work)
		workRepo: EntityRepository<Work>,
	) {
		super((entryId) => workRepo.findOneOrFail({ id: entryId }));
	}
}
