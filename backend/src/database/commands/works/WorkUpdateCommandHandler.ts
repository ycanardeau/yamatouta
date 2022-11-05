import { WorkDto } from '@/dto/WorkDto';
import { WorkAuditLogEntry } from '@/entities/AuditLogEntry';
import { Work } from '@/entities/Work';
import { AuditedAction } from '@/models/AuditedAction';
import { Permission } from '@/models/Permission';
import { RevisionEvent } from '@/models/RevisionEvent';
import { WorkOptionalField } from '@/models/works/WorkOptionalField';
import { WorkUpdateParams } from '@/models/works/WorkUpdateParams';
import { ArtistLinkService } from '@/services/ArtistLinkService';
import { NgramConverter } from '@/services/NgramConverter';
import { PermissionContext } from '@/services/PermissionContext';
import { RevisionService } from '@/services/RevisionService';
import { WebLinkService } from '@/services/WebLinkService';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

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
	static readonly populate = [
		'searchIndex',
		'webLinks',
		'webLinks.address',
		'webLinks.address.host',
		'artistLinks',
		'artistLinks.relatedArtist',
	] as const;

	constructor(
		private readonly em: EntityManager,
		@InjectRepository(Work)
		private readonly workRepo: EntityRepository<Work>,
		private readonly webLinkService: WebLinkService,
		private readonly artistLinkService: ArtistLinkService,
		private readonly revisionService: RevisionService,
		private readonly ngramConverter: NgramConverter,
	) {}

	async execute(command: WorkUpdateCommand): Promise<WorkDto> {
		const { permissionContext, params } = command;

		permissionContext.verifyPermission(Permission.UpdateWorks);

		const result = WorkUpdateParams.schema.validate(params, {
			convert: true,
		});

		if (result.error)
			throw new BadRequestException(result.error.details[0].message);

		const isNew = params.id === 0;

		const work = await this.em.transactional(async (em) => {
			const actor = await permissionContext.getCurrentUser(em);

			const work = isNew
				? new Work(actor)
				: await this.workRepo.findOneOrFail(
						{ id: params.id },
						{ populate: WorkUpdateCommandHandler.populate },
				  );

			permissionContext.verifyDeletedAndHidden(work);

			em.persist(work);

			await this.revisionService.create(
				em,
				work,
				async () => {
					work.name = params.name;
					work.workType = params.workType;

					work.updateSearchIndex(this.ngramConverter);

					await this.webLinkService.sync(
						em,
						work,
						params.webLinks,
						permissionContext,
						actor,
					);

					await this.artistLinkService.sync(
						em,
						work,
						params.artistLinks,
						permissionContext,
					);
				},
				actor,
				isNew ? RevisionEvent.Created : RevisionEvent.Updated,
				false,
			);

			const auditLogEntry = new WorkAuditLogEntry({
				action: isNew
					? AuditedAction.Work_Create
					: AuditedAction.Work_Update,
				work: work,
				actor: actor,
				actorIp: permissionContext.clientIp,
			});

			em.persist(auditLogEntry);

			return work;
		});

		return WorkDto.create(
			permissionContext,
			work,
			Object.values(WorkOptionalField),
		);
	}
}
