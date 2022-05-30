import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Artist } from '../../entities/Artist';
import {
	ArtistAuditLogEntry,
	AuditLogEntry,
	QuoteAuditLogEntry,
	TranslationAuditLogEntry,
	WorkAuditLogEntry,
} from '../../entities/AuditLogEntry';
import { Commit } from '../../entities/Commit';
import { Quote } from '../../entities/Quote';
import { Translation } from '../../entities/Translation';
import { User } from '../../entities/User';
import { Work } from '../../entities/Work';
import { AuditedAction } from '../../models/AuditedAction';
import { Entry } from '../../models/Entry';
import { EntryDeleteParams } from '../../models/EntryDeleteParams';
import { Permission } from '../../models/Permission';
import { RevisionEvent } from '../../models/RevisionEvent';
import { PermissionContext } from '../../services/PermissionContext';

abstract class EntryDeleteCommand {
	constructor(
		readonly permissionContext: PermissionContext,
		readonly params: EntryDeleteParams,
	) {}
}

abstract class EntryDeleteCommandHandler<
	TEntry extends Entry,
	TCommand extends EntryDeleteCommand,
> {
	constructor(
		private readonly em: EntityManager,
		private readonly permission: Permission,
		private readonly entryFunc: (id: number) => Promise<TEntry>,
		private readonly auditLogFunc: (
			entry: TEntry,
			actor: User,
			actorIp: string,
		) => AuditLogEntry,
	) {}

	async execute(command: TCommand): Promise<void> {
		const { permissionContext, params } = command;

		permissionContext.verifyPermission(this.permission);

		await this.em.transactional(async (em) => {
			const entry = await this.entryFunc(params.id);

			permissionContext.verifyDeletedAndHidden(entry);

			if (entry.deleted) {
				throw new BadRequestException(
					'This entry has already been deleted.',
				);
			}

			const user = await permissionContext.getCurrentUser(em);

			entry.deleted = true;

			const commit = new Commit();

			const revision = entry.createRevision({
				commit: commit,
				actor: user,
				event: RevisionEvent.Deleted,
				summary: '',
			});

			em.persist(revision);

			const auditLogEntry = this.auditLogFunc(
				entry,
				user,
				permissionContext.clientIp,
			);

			em.persist(auditLogEntry);
		});
	}
}

export class TranslationDeleteCommand extends EntryDeleteCommand {}

@CommandHandler(TranslationDeleteCommand)
export class TranslationDeleteCommandHandler
	extends EntryDeleteCommandHandler<Translation, TranslationDeleteCommand>
	implements ICommandHandler<TranslationDeleteCommand>
{
	constructor(
		em: EntityManager,
		@InjectRepository(Translation)
		translationRepo: EntityRepository<Translation>,
	) {
		super(
			em,
			Permission.Translation_Delete,
			(id) =>
				translationRepo.findOneOrFail({ id: id }, { populate: true }),
			(entry, actor, actorIp) =>
				new TranslationAuditLogEntry({
					action: AuditedAction.Translation_Delete,
					translation: entry,
					actor: actor,
					actorIp: actorIp,
				}),
		);
	}
}

export class ArtistDeleteCommand extends EntryDeleteCommand {}

@CommandHandler(ArtistDeleteCommand)
export class ArtistDeleteCommandHandler
	extends EntryDeleteCommandHandler<Artist, ArtistDeleteCommand>
	implements ICommandHandler<ArtistDeleteCommand>
{
	constructor(
		em: EntityManager,
		@InjectRepository(Artist)
		artistRepo: EntityRepository<Artist>,
	) {
		super(
			em,
			Permission.Artist_Delete,
			(id) => artistRepo.findOneOrFail({ id: id }, { populate: true }),
			(entry, actor, actorIp) =>
				new ArtistAuditLogEntry({
					action: AuditedAction.Artist_Delete,
					artist: entry,
					actor: actor,
					actorIp: actorIp,
				}),
		);
	}
}

export class QuoteDeleteCommand extends EntryDeleteCommand {}

@CommandHandler(QuoteDeleteCommand)
export class QuoteDeleteCommandHandler
	extends EntryDeleteCommandHandler<Quote, QuoteDeleteCommand>
	implements ICommandHandler<QuoteDeleteCommand>
{
	constructor(
		em: EntityManager,
		@InjectRepository(Quote)
		quoteRepo: EntityRepository<Quote>,
	) {
		super(
			em,
			Permission.Quote_Delete,
			(id) => quoteRepo.findOneOrFail({ id: id }, { populate: true }),
			(entry, actor, actorIp) =>
				new QuoteAuditLogEntry({
					action: AuditedAction.Quote_Delete,
					quote: entry,
					actor: actor,
					actorIp: actorIp,
				}),
		);
	}
}

export class WorkDeleteCommand extends EntryDeleteCommand {}

@CommandHandler(WorkDeleteCommand)
export class WorkDeleteCommandHandler
	extends EntryDeleteCommandHandler<Work, WorkDeleteCommand>
	implements ICommandHandler<WorkDeleteCommand>
{
	constructor(
		em: EntityManager,
		@InjectRepository(Work)
		workRepo: EntityRepository<Work>,
	) {
		super(
			em,
			Permission.Work_Delete,
			(id) => workRepo.findOneOrFail({ id: id }, { populate: true }),
			(entry, actor, actorIp) =>
				new WorkAuditLogEntry({
					action: AuditedAction.Work_Delete,
					work: entry,
					actor: actor,
					actorIp: actorIp,
				}),
		);
	}
}