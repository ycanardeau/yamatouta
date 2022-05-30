import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { WorkObject } from '../../../dto/WorkObject';
import { WorkAuditLogEntry } from '../../../entities/AuditLogEntry';
import { Commit } from '../../../entities/Commit';
import { Work } from '../../../entities/Work';
import { AuditedAction } from '../../../models/AuditedAction';
import { Permission } from '../../../models/Permission';
import { RevisionEvent } from '../../../models/RevisionEvent';
import { WorkOptionalField } from '../../../models/works/WorkOptionalField';
import { WorkUpdateParams } from '../../../models/works/WorkUpdateParams';
import { ArtistLinkService } from '../../../services/ArtistLinkService';
import { PermissionContext } from '../../../services/PermissionContext';
import { WebLinkService } from '../../../services/WebLinkService';

export class WorkUpdateCommand {
	constructor(
		readonly permissionContext: PermissionContext,
		readonly params: WorkUpdateParams,
	) {}
}

@CommandHandler(WorkUpdateCommand)
export class WorkUpdateCommandHandler
	implements ICommandHandler<WorkUpdateCommand>
{
	constructor(
		private readonly em: EntityManager,
		@InjectRepository(Work)
		private readonly workRepo: EntityRepository<Work>,
		private readonly webLinkService: WebLinkService,
		private readonly artistLinkService: ArtistLinkService,
	) {}

	async execute(command: WorkUpdateCommand): Promise<WorkObject> {
		const { permissionContext, params } = command;

		permissionContext.verifyPermission(Permission.Work_Update);

		const result = WorkUpdateParams.schema.validate(params, {
			convert: true,
		});

		if (result.error)
			throw new BadRequestException(result.error.details[0].message);

		const isNew = params.id === 0;

		const work = await this.em.transactional(async (em) => {
			const user = await permissionContext.getCurrentUser(em);

			const work = isNew
				? new Work()
				: await this.workRepo.findOneOrFail(
						{
							id: params.id,
							deleted: false,
							hidden: false,
						},
						{ populate: true },
				  );

			em.persist(work);

			const latestSnapshot = isNew ? undefined : work.takeSnapshot();

			work.name = params.name;
			work.workType = params.workType;

			await this.webLinkService.sync(
				em,
				work,
				params.webLinks,
				permissionContext,
				user,
			);

			await this.artistLinkService.sync(
				em,
				work,
				params.artistLinks,
				permissionContext,
			);

			const commit = new Commit();

			const revision = work.createRevision({
				commit: commit,
				actor: user,
				event: isNew ? RevisionEvent.Created : RevisionEvent.Updated,
				summary: '',
			});

			if (revision.snapshot.contentEquals(latestSnapshot)) {
				throw new BadRequestException('Nothing has changed.');
			}

			em.persist(revision);

			const auditLogEntry = new WorkAuditLogEntry({
				action: isNew
					? AuditedAction.Work_Create
					: AuditedAction.Work_Update,
				work: work,
				actor: user,
				actorIp: permissionContext.clientIp,
			});

			em.persist(auditLogEntry);

			return work;
		});

		return WorkObject.create(
			work,
			permissionContext,
			Object.values(WorkOptionalField),
		);
	}
}