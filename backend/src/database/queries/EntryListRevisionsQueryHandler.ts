import { EntityRepository, QueryOrder } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { RevisionObject } from '../../dto/RevisionObject';
import { SearchResultObject } from '../../dto/SearchResultObject';
import { Artist } from '../../entities/Artist';
import { Quote } from '../../entities/Quote';
import { Translation } from '../../entities/Translation';
import { Work } from '../../entities/Work';
import { EntryWithRevisions } from '../../models/Entry';
import { EntryListRevisionsParams } from '../../models/EntryListRevisionsParams';
import { Permission } from '../../models/Permission';
import { PermissionContext } from '../../services/PermissionContext';

export abstract class EntryListRevisionsQuery {
	constructor(
		readonly permissionContext: PermissionContext,
		readonly params: EntryListRevisionsParams,
	) {}
}

abstract class EntryListRevisionsQueryHandler<
	TEntry extends EntryWithRevisions,
	TQuery extends EntryListRevisionsQuery,
> {
	constructor(private readonly entryFunc: (id: number) => Promise<TEntry>) {}

	async execute(query: TQuery): Promise<SearchResultObject<RevisionObject>> {
		const { permissionContext, params } = query;

		permissionContext.verifyPermission(Permission.ViewRevisions);

		const entry = await this.entryFunc(params.id);

		permissionContext.verifyDeletedAndHidden(entry);

		const revisions = await entry.revisions.matching({
			where: {
				deleted: false,
				hidden: false,
			},
			orderBy: { version: QueryOrder.DESC },
			populate: ['actor'],
		});

		return SearchResultObject.create(
			revisions.map((revision) =>
				RevisionObject.create(permissionContext, revision),
			),
			revisions.length,
		);
	}
}

export class TranslationListRevisionsQuery extends EntryListRevisionsQuery {}

@QueryHandler(TranslationListRevisionsQuery)
export class TranslationListRevisionsQueryHandler
	extends EntryListRevisionsQueryHandler<
		Translation,
		TranslationListRevisionsQuery
	>
	implements IQueryHandler<TranslationListRevisionsQuery>
{
	constructor(
		@InjectRepository(Translation)
		translationRepo: EntityRepository<Translation>,
	) {
		super((id) => translationRepo.findOneOrFail({ id: id }));
	}
}

export class ArtistListRevisionsQuery extends EntryListRevisionsQuery {}

@QueryHandler(ArtistListRevisionsQuery)
export class ArtistListRevisionsQueryHandler
	extends EntryListRevisionsQueryHandler<Artist, ArtistListRevisionsQuery>
	implements IQueryHandler<ArtistListRevisionsQuery>
{
	constructor(
		@InjectRepository(Artist)
		artistRepo: EntityRepository<Artist>,
	) {
		super((id) => artistRepo.findOneOrFail({ id: id }));
	}
}

export class QuoteListRevisionsQuery extends EntryListRevisionsQuery {}

@QueryHandler(QuoteListRevisionsQuery)
export class QuoteListRevisionsQueryHandler
	extends EntryListRevisionsQueryHandler<Quote, QuoteListRevisionsQuery>
	implements IQueryHandler<QuoteListRevisionsQuery>
{
	constructor(
		@InjectRepository(Quote)
		quoteRepo: EntityRepository<Quote>,
	) {
		super((id) => quoteRepo.findOneOrFail({ id: id }));
	}
}

export class WorkListRevisionsQuery extends EntryListRevisionsQuery {}

@QueryHandler(WorkListRevisionsQuery)
export class WorkListRevisionsQueryHandler
	extends EntryListRevisionsQueryHandler<Work, WorkListRevisionsQuery>
	implements IQueryHandler<WorkListRevisionsQuery>
{
	constructor(
		@InjectRepository(Work)
		workRepo: EntityRepository<Work>,
	) {
		super((id) => workRepo.findOneOrFail({ id: id }));
	}
}
