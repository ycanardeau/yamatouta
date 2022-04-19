import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import Joi, { ObjectSchema } from 'joi';

import { WorkObject } from '../../../dto/works/WorkObject';
import { Commit } from '../../../entities/Commit';
import { User } from '../../../entities/User';
import { Work } from '../../../entities/Work';
import { Permission } from '../../../models/Permission';
import { RevisionEvent } from '../../../models/RevisionEvent';
import { WorkType } from '../../../models/WorkType';
import { AuditLogEntryFactory } from '../../../services/AuditLogEntryFactory';
import { PermissionContext } from '../../../services/PermissionContext';

export class UpdateWorkCommand {
	static readonly schema: ObjectSchema<UpdateWorkCommand> = Joi.object({
		workId: Joi.number().optional(),
		name: Joi.string().required().trim().max(200),
		workType: Joi.string()
			.required()
			.trim()
			.valid(...Object.values(WorkType)),
	});

	constructor(
		readonly workId: number | undefined,
		readonly name: string,
		readonly workType: WorkType,
	) {}
}

@CommandHandler(UpdateWorkCommand)
export class UpdateWorkCommandHandler
	implements ICommandHandler<UpdateWorkCommand>
{
	constructor(
		private readonly permissionContext: PermissionContext,
		private readonly em: EntityManager,
		@InjectRepository(User)
		private readonly userRepo: EntityRepository<User>,
		private readonly auditLogEntryFactory: AuditLogEntryFactory,
		@InjectRepository(Work)
		private readonly workRepo: EntityRepository<Work>,
	) {}

	async execute(command: UpdateWorkCommand): Promise<WorkObject> {
		this.permissionContext.verifyPermission(Permission.EditWorks);

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

			const work = await this.workRepo.findOneOrFail({
				id: command.workId,
				deleted: false,
				hidden: false,
			});

			work.name = command.name;
			work.workType = command.workType;

			const commit = new Commit();

			const revision = work.createRevision({
				commit: commit,
				actor: user,
				event: RevisionEvent.Updated,
				summary: '',
			});

			em.persist(revision);

			const auditLogEntry = this.auditLogEntryFactory.work_update({
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
