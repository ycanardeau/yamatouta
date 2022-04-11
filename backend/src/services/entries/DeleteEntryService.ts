import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';

import { Artist } from '../../entities/Artist';
import { Commit } from '../../entities/Commit';
import { Quote } from '../../entities/Quote';
import { Translation } from '../../entities/Translation';
import { User } from '../../entities/User';
import { Work } from '../../entities/Work';
import { Entry } from '../../models/Entry';
import { Permission } from '../../models/Permission';
import { RevisionEvent } from '../../models/RevisionEvent';
import { AuditLogService } from '../AuditLogService';
import { PermissionContext } from '../PermissionContext';

abstract class DeleteEntryService<TEntry extends Entry> {
	constructor(
		protected readonly permissionContext: PermissionContext,
		private readonly em: EntityManager,
		@InjectRepository(User)
		private readonly userRepo: EntityRepository<User>,
		protected readonly auditLogService: AuditLogService,
		private readonly permission: Permission,
		private readonly entryFunc: (entryId: number) => Promise<TEntry>,
		private readonly auditLogFunc: (actor: User, entry: TEntry) => void,
	) {}

	async deleteEntry(entryId: number): Promise<void> {
		this.permissionContext.verifyPermission(this.permission);

		await this.em.transactional(async (em) => {
			const entry = await this.entryFunc(entryId);

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

			this.auditLogFunc(user, entry);
		});
	}
}

@Injectable()
export class DeleteTranslationService extends DeleteEntryService<Translation> {
	constructor(
		permissionContext: PermissionContext,
		em: EntityManager,
		@InjectRepository(User)
		userRepo: EntityRepository<User>,
		auditLogService: AuditLogService,
		@InjectRepository(Translation)
		translationRepo: EntityRepository<Translation>,
	) {
		super(
			permissionContext,
			em,
			userRepo,
			auditLogService,
			Permission.DeleteTranslations,
			(entryId) => translationRepo.findOneOrFail({ id: entryId }),
			(actor, entry) =>
				this.auditLogService.translation_delete({
					actor: actor,
					actorIp: this.permissionContext.remoteIpAddress,
					translation: entry,
				}),
		);
	}
}

@Injectable()
export class DeleteArtistService extends DeleteEntryService<Artist> {
	constructor(
		permissionContext: PermissionContext,
		em: EntityManager,
		@InjectRepository(User)
		userRepo: EntityRepository<User>,
		auditLogService: AuditLogService,
		@InjectRepository(Artist)
		artistRepo: EntityRepository<Artist>,
	) {
		super(
			permissionContext,
			em,
			userRepo,
			auditLogService,
			Permission.DeleteArtists,
			(entryId) => artistRepo.findOneOrFail({ id: entryId }),
			(actor, entry) =>
				this.auditLogService.artist_delete({
					actor: actor,
					actorIp: this.permissionContext.remoteIpAddress,
					artist: entry,
				}),
		);
	}
}

@Injectable()
export class DeleteQuoteService extends DeleteEntryService<Quote> {
	constructor(
		permissionContext: PermissionContext,
		em: EntityManager,
		@InjectRepository(User)
		userRepo: EntityRepository<User>,
		auditLogService: AuditLogService,
		@InjectRepository(Quote)
		quoteRepo: EntityRepository<Quote>,
	) {
		super(
			permissionContext,
			em,
			userRepo,
			auditLogService,
			Permission.DeleteQuotes,
			(entryId) => quoteRepo.findOneOrFail({ id: entryId }),
			(actor, entry) =>
				this.auditLogService.quote_delete({
					actor: actor,
					actorIp: this.permissionContext.remoteIpAddress,
					quote: entry,
				}),
		);
	}
}

@Injectable()
export class DeleteWorkService extends DeleteEntryService<Work> {
	constructor(
		permissionContext: PermissionContext,
		em: EntityManager,
		@InjectRepository(User)
		userRepo: EntityRepository<User>,
		auditLogService: AuditLogService,
		@InjectRepository(Work)
		workRepo: EntityRepository<Work>,
	) {
		super(
			permissionContext,
			em,
			userRepo,
			auditLogService,
			Permission.DeleteWorks,
			(entryId) => workRepo.findOneOrFail({ id: entryId }),
			(actor, entry) =>
				this.auditLogService.work_delete({
					actor: actor,
					actorIp: this.permissionContext.remoteIpAddress,
					work: entry,
				}),
		);
	}
}
