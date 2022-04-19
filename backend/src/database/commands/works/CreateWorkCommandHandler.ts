import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException } from '@nestjs/common';

import { WorkObject } from '../../../dto/works/WorkObject';
import { Commit } from '../../../entities/Commit';
import { User } from '../../../entities/User';
import { Work } from '../../../entities/Work';
import { Permission } from '../../../models/Permission';
import { RevisionEvent } from '../../../models/RevisionEvent';
import { AuditLogEntryFactory } from '../../../services/AuditLogEntryFactory';
import { PermissionContext } from '../../../services/PermissionContext';
import { CommandHandler, ICommandHandler } from '../ICommandHandler';
import { UpdateWorkCommand } from './UpdateWorkCommandHandler';

export class CreateWorkCommand extends UpdateWorkCommand {}

@CommandHandler(CreateWorkCommand)
export class CreateWorkCommandHandler
	implements ICommandHandler<CreateWorkCommand>
{
	constructor(
		private readonly permissionContext: PermissionContext,
		private readonly em: EntityManager,
		@InjectRepository(User)
		private readonly userRepo: EntityRepository<User>,
		private readonly auditLogEntryFactory: AuditLogEntryFactory,
	) {}

	async execute(command: CreateWorkCommand): Promise<WorkObject> {
		this.permissionContext.verifyPermission(Permission.CreateWorks);

		const result = CreateWorkCommand.schema.validate(command, {
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

			const auditLogEntry = this.auditLogEntryFactory.work_create({
				work: work,
				actor: user,
				actorIp: this.permissionContext.clientIp,
			});

			em.persist(auditLogEntry);

			return work;
		});

		return new WorkObject(work, this.permissionContext);
	}
}
