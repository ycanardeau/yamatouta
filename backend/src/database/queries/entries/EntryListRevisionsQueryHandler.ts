import { EntityRepository, QueryOrder } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import Joi from 'joi';

import { RevisionObject } from '../../../dto/RevisionObject';
import { SearchResultObject } from '../../../dto/SearchResultObject';
import { Artist } from '../../../entities/Artist';
import { Quote } from '../../../entities/Quote';
import { Translation } from '../../../entities/Translation';
import { Work } from '../../../entities/Work';
import { Entry } from '../../../models/Entry';
import { Permission } from '../../../models/Permission';
import { PermissionContext } from '../../../services/PermissionContext';
import { whereNotDeleted, whereNotHidden } from '../../../services/filters';

export class EntryListRevisionsParams {
	static readonly schema = Joi.object<EntryListRevisionsParams>({
		id: Joi.number().required(),
	});

	constructor(readonly id: number) {}
}

export abstract class EntryListRevisionsQuery {
	constructor(
		readonly permissionContext: PermissionContext,
		readonly params: EntryListRevisionsParams,
	) {}
}

abstract class EntryListRevisionsQueryHandler<
	TEntry extends Entry,
	TQuery extends EntryListRevisionsQuery,
> {
	constructor(private readonly entryFunc: (id: number) => Promise<TEntry>) {}

	async execute(query: TQuery): Promise<SearchResultObject<RevisionObject>> {
		const { permissionContext, params } = query;

		permissionContext.verifyPermission(Permission.Revision_View);

		const entry = await this.entryFunc(params.id);

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
