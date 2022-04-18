import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';

import { WorkObject } from '../../../dto/works/WorkObject';
import { Commit } from '../../../entities/Commit';
import { User } from '../../../entities/User';
import { Work } from '../../../entities/Work';
import { Permission } from '../../../models/Permission';
import { RevisionEvent } from '../../../models/RevisionEvent';
import {
	IUpdateWorkBody,
	updateWorkBodySchema,
} from '../../../requests/works/IUpdateWorkBody';
import { AuditLogger } from '../../AuditLogger';
import { PermissionContext } from '../../PermissionContext';

@Injectable()
export class UpdateWorkCommandHandler {
	constructor(
		private readonly permissionContext: PermissionContext,
		private readonly em: EntityManager,
		@InjectRepository(User)
		private readonly userRepo: EntityRepository<User>,
		private readonly auditLogger: AuditLogger,
		@InjectRepository(Work)
		private readonly workRepo: EntityRepository<Work>,
	) {}

	async execute(
		workId: number,
		params: IUpdateWorkBody,
	): Promise<WorkObject> {
		this.permissionContext.verifyPermission(Permission.EditWorks);

		const result = updateWorkBodySchema.validate(params, {
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

			const work = await this.workRepo.findOneOrFail({
				id: workId,
				deleted: false,
				hidden: false,
			});

			work.name = params.name;
			work.workType = params.workType;

			const commit = new Commit();

			const revision = work.createRevision({
				commit: commit,
				actor: user,
				event: RevisionEvent.Updated,
				summary: '',
			});

			em.persist(revision);

			this.auditLogger.work_update({
				actor: user,
				actorIp: this.permissionContext.remoteIpAddress,
				work: work,
			});

			return work;
		});

		return new WorkObject(work, this.permissionContext);
	}
}
