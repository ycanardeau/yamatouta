import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';

import { WorkObject } from '../../../dto/works/WorkObject';
import { Commit } from '../../../entities/Commit';
import { User } from '../../../entities/User';
import { Work } from '../../../entities/Work';
import { Permission } from '../../../models/Permission';
import { RevisionEvent } from '../../../models/RevisionEvent';
import { AuditLogger } from '../../../services/AuditLogger';
import { PermissionContext } from '../../../services/PermissionContext';
import { UpdateWorkCommand } from './UpdateWorkCommandHandler';

@Injectable()
export class CreateWorkCommandHandler {
	constructor(
		private readonly permissionContext: PermissionContext,
		private readonly em: EntityManager,
		@InjectRepository(User)
		private readonly userRepo: EntityRepository<User>,
		private readonly auditLogger: AuditLogger,
	) {}

	async execute(command: UpdateWorkCommand): Promise<WorkObject> {
		this.permissionContext.verifyPermission(Permission.CreateWorks);

		const result = UpdateWorkCommand.schema.validate(command, {
			convert: true,
		});

		if (result.error)
			throw new BadRequestException(result.error.details[0].message);

		const work = await this.em.transactional(async (em) => {
			const user = await this.userRepo.findOneOrFail({
				id: this.permissionContext.user?.id,
				deleted: false,
				hidden: false,
			});

			const work = new Work({
				name: command.name,
				workType: command.workType,
			});

			em.persist(work);

			const commit = new Commit();

			const revision = work.createRevision({
				commit: commit,
				actor: user,
				event: RevisionEvent.Created,
				summary: '',
			});

			em.persist(revision);

			this.auditLogger.work_create({
				actor: user,
				actorIp: this.permissionContext.clientIp,
				work: work,
			});

			return work;
		});

		return new WorkObject(work, this.permissionContext);
	}
}
