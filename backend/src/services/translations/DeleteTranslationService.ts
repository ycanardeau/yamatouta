import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';

import { Revision } from '../../entities/Revision';
import { Translation } from '../../entities/Translation';
import { User } from '../../entities/User';
import { ChangeLogEvent } from '../../models/ChangeLogEvent';
import { Permission } from '../../models/Permission';
import { AuditLogService } from '../AuditLogService';
import { PermissionContext } from '../PermissionContext';

@Injectable()
export class DeleteTranslationService {
	constructor(
		private readonly permissionContext: PermissionContext,
		private readonly em: EntityManager,
		@InjectRepository(User)
		private readonly userRepo: EntityRepository<User>,
		@InjectRepository(Translation)
		private readonly translationRepo: EntityRepository<Translation>,
		private readonly auditLogService: AuditLogService,
	) {}

	async deleteTranslation(translationId: number): Promise<void> {
		this.permissionContext.verifyPermission(Permission.DeleteTranslations);

		await this.em.transactional(async (em) => {
			const translation = await this.translationRepo.findOneOrFail({
				id: translationId,
			});

			this.permissionContext.verifyDeletedAndHidden(translation);

			if (translation.deleted)
				throw new BadRequestException(
					'This translation has already been deleted.',
				);

			const user = await this.userRepo.findOneOrFail({
				id: this.permissionContext.user?.id,
				deleted: false,
				hidden: false,
			});

			const revision = new Revision();

			em.persist(revision);

			const changeLogEntry = translation.createChangeLogEntry({
				revision: revision,
				actor: user,
				actionType: ChangeLogEvent.Deleted,
				text: '',
			});

			revision.changeLogEntries.add(changeLogEntry);

			translation.deleted = true;

			this.auditLogService.translation_delete({
				actor: user,
				actorIp: this.permissionContext.remoteIpAddress,
				translation: translation,
			});
		});
	}
}
