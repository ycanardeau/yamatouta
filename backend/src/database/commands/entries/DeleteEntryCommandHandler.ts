import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException } from '@nestjs/common';

import { Artist } from '../../../entities/Artist';
import { AuditLogEntry } from '../../../entities/AuditLogEntry';
import { Commit } from '../../../entities/Commit';
import { Quote } from '../../../entities/Quote';
import { Translation } from '../../../entities/Translation';
import { User } from '../../../entities/User';
import { Work } from '../../../entities/Work';
import { Entry } from '../../../models/Entry';
import { Permission } from '../../../models/Permission';
import { RevisionEvent } from '../../../models/RevisionEvent';
import { AuditLogEntryFactory } from '../../../services/AuditLogEntryFactory';
import { PermissionContext } from '../../../services/PermissionContext';
import { CommandHandler, ICommandHandler } from '../ICommandHandler';

abstract class DeleteEntryCommand {
	constructor(readonly entryId: number) {}
}

abstract class DeleteEntryCommandHandler<
	TEntry extends Entry,
	TCommand extends DeleteEntryCommand,
> {
	constructor(
		protected readonly permissionContext: PermissionContext,
		private readonly em: EntityManager,
		@InjectRepository(User)
		private readonly userRepo: EntityRepository<User>,
		protected readonly auditLogEntryFactory: AuditLogEntryFactory,
		private readonly permission: Permission,
		private readonly entryFunc: (entryId: number) => Promise<TEntry>,
		private readonly auditLogFunc: (
			actor: User,
			entry: TEntry,
		) => AuditLogEntry,
	) {}

	async execute(command: TCommand): Promise<void> {
		this.permissionContext.verifyPermission(this.permission);

		await this.em.transactional(async (em) => {
			const entry = await this.entryFunc(command.entryId);

			this.permissionContext.verifyDeletedAndHidden(entry);

			if (entry.deleted) {
				throw new BadRequestException(
					'This entry has already been deleted.',
				);
			}

			const user = await this.userRepo.findOneOrFail({
				id: this.permissionContext.user?.id,
				deleted: false,
				hidden: false,
			});

			entry.deleted = true;

			const commit = new Commit();

			const revision = entry.createRevision({
				commit: commit,
				actor: user,
				event: RevisionEvent.Deleted,
				summary: '',
			});

			em.persist(revision);

			const auditLogEntry = this.auditLogFunc(user, entry);

			em.persist(auditLogEntry);
		});
	}
}

export class DeleteTranslationCommand extends DeleteEntryCommand {}

@CommandHandler(DeleteTranslationCommand)
export class DeleteTranslationCommandHandler
	extends DeleteEntryCommandHandler<Translation, DeleteTranslationCommand>
	implements ICommandHandler<DeleteTranslationCommand>
{
	constructor(
		permissionContext: PermissionContext,
		em: EntityManager,
		@InjectRepository(User)
		userRepo: EntityRepository<User>,
		auditLogEntryFactory: AuditLogEntryFactory,
		@InjectRepository(Translation)
		translationRepo: EntityRepository<Translation>,
	) {
		super(
			permissionContext,
			em,
			userRepo,
			auditLogEntryFactory,
			Permission.DeleteTranslations,
			(entryId) => translationRepo.findOneOrFail({ id: entryId }),
			(actor, entry) =>
				this.auditLogEntryFactory.translation_delete({
					translation: entry,
					actor: actor,
					actorIp: this.permissionContext.clientIp,
				}),
		);
	}
}

export class DeleteArtistCommand extends DeleteEntryCommand {}

@CommandHandler(DeleteArtistCommand)
export class DeleteArtistCommandHandler
	extends DeleteEntryCommandHandler<Artist, DeleteArtistCommand>
	implements ICommandHandler<DeleteArtistCommand>
{
	constructor(
		permissionContext: PermissionContext,
		em: EntityManager,
		@InjectRepository(User)
		userRepo: EntityRepository<User>,
		auditLogEntryFactory: AuditLogEntryFactory,
		@InjectRepository(Artist)
		artistRepo: EntityRepository<Artist>,
	) {
		super(
			permissionContext,
			em,
			userRepo,
			auditLogEntryFactory,
			Permission.DeleteArtists,
			(entryId) => artistRepo.findOneOrFail({ id: entryId }),
			(actor, entry) =>
				this.auditLogEntryFactory.artist_delete({
					artist: entry,
					actor: actor,
					actorIp: this.permissionContext.clientIp,
				}),
		);
	}
}

export class DeleteQuoteCommand extends DeleteEntryCommand {}

@CommandHandler(DeleteQuoteCommand)
export class DeleteQuoteCommandHandler
	extends DeleteEntryCommandHandler<Quote, DeleteQuoteCommand>
	implements ICommandHandler<DeleteQuoteCommand>
{
	constructor(
		permissionContext: PermissionContext,
		em: EntityManager,
		@InjectRepository(User)
		userRepo: EntityRepository<User>,
		auditLogEntryFactory: AuditLogEntryFactory,
		@InjectRepository(Quote)
		quoteRepo: EntityRepository<Quote>,
	) {
		super(
			permissionContext,
			em,
			userRepo,
			auditLogEntryFactory,
			Permission.DeleteQuotes,
			(entryId) => quoteRepo.findOneOrFail({ id: entryId }),
			(actor, entry) =>
				this.auditLogEntryFactory.quote_delete({
					quote: entry,
					actor: actor,
					actorIp: this.permissionContext.clientIp,
				}),
		);
	}
}

export class DeleteWorkCommand extends DeleteEntryCommand {}

@CommandHandler(DeleteWorkCommand)
export class DeleteWorkCommandHandler
	extends DeleteEntryCommandHandler<Work, DeleteWorkCommand>
	implements ICommandHandler<DeleteWorkCommand>
{
	constructor(
		permissionContext: PermissionContext,
		em: EntityManager,
		@InjectRepository(User)
		userRepo: EntityRepository<User>,
		auditLogEntryFactory: AuditLogEntryFactory,
		@InjectRepository(Work)
		workRepo: EntityRepository<Work>,
	) {
		super(
			permissionContext,
			em,
			userRepo,
			auditLogEntryFactory,
			Permission.DeleteWorks,
			(entryId) => workRepo.findOneOrFail({ id: entryId }),
			(actor, entry) =>
				this.auditLogEntryFactory.work_delete({
					work: entry,
					actor: actor,
					actorIp: this.permissionContext.clientIp,
				}),
		);
	}
}
