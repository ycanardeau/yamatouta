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

export class UpdateWorkParams {
	static readonly schema: ObjectSchema<UpdateWorkParams> = Joi.object({
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

export class UpdateWorkCommand {
	constructor(
		readonly permissionContext: PermissionContext,
		readonly params: UpdateWorkParams,
	) {}
}

@CommandHandler(UpdateWorkCommand)
export class UpdateWorkCommandHandler
	implements ICommandHandler<UpdateWorkCommand>
{
	constructor(
		private readonly em: EntityManager,
		@InjectRepository(User)
		private readonly userRepo: EntityRepository<User>,
		private readonly auditLogEntryFactory: AuditLogEntryFactory,
		@InjectRepository(Work)
		private readonly workRepo: EntityRepository<Work>,
	) {}

	async execute(command: UpdateWorkCommand): Promise<WorkObject> {
		const { permissionContext, params } = command;

		permissionContext.verifyPermission(Permission.EditWorks);

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

			const work = await this.workRepo.findOneOrFail({
				id: params.workId,
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

			const auditLogEntry = this.auditLogEntryFactory.work_update({
				work: work,
				actor: user,
				actorIp: permissionContext.clientIp,
			});

			em.persist(auditLogEntry);

			return work;
		});

		return new WorkObject(work, permissionContext);
	}
}
