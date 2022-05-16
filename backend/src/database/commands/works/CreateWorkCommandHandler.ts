import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { WorkObject } from '../../../dto/WorkObject';
import { Commit } from '../../../entities/Commit';
import { User } from '../../../entities/User';
import { Work } from '../../../entities/Work';
import { Permission } from '../../../models/Permission';
import { RevisionEvent } from '../../../models/RevisionEvent';
import { WorkOptionalField } from '../../../models/WorkOptionalField';
import { AuditLogEntryFactory } from '../../../services/AuditLogEntryFactory';
import { PermissionContext } from '../../../services/PermissionContext';
import { UpdateWorkParams } from './UpdateWorkCommandHandler';

export class CreateWorkCommand {
	constructor(
		readonly permissionContext: PermissionContext,
		readonly params: UpdateWorkParams,
	) {}
}

@CommandHandler(CreateWorkCommand)
export class CreateWorkCommandHandler
	implements ICommandHandler<CreateWorkCommand>
{
	constructor(
		private readonly em: EntityManager,
		@InjectRepository(User)
		private readonly userRepo: EntityRepository<User>,
		private readonly auditLogEntryFactory: AuditLogEntryFactory,
	) {}

	async execute(command: CreateWorkCommand): Promise<WorkObject> {
		const { permissionContext, params } = command;

		permissionContext.verifyPermission(Permission.CreateWorks);

		const result = UpdateWorkParams.schema.validate(params, {
			convert: true,
		});

		if (result.error)
			throw new BadRequestException(result.error.details[0].message);

		const work = await this.em.transactional(async (em) => {
			const user = await this.userRepo.findOneOrFail({
				id: permissionContext.user?.id,
				deleted: false,
				hidden: false,
			});

			const work = new Work({
				name: params.name,
				workType: params.workType,
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
				actorIp: permissionContext.clientIp,
			});

			em.persist(auditLogEntry);

			return work;
		});

		return new WorkObject(
			work,
			permissionContext,
			Object.values(WorkOptionalField),
		);
	}
}
