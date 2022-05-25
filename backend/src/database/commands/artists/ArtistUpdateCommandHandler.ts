import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import Joi from 'joi';

import { ArtistObject } from '../../../dto/ArtistObject';
import { Artist } from '../../../entities/Artist';
import { ArtistAuditLogEntry } from '../../../entities/AuditLogEntry';
import { Commit } from '../../../entities/Commit';
import { ArtistOptionalField } from '../../../models/ArtistOptionalField';
import { ArtistType } from '../../../models/ArtistType';
import { AuditedAction } from '../../../models/AuditedAction';
import { Permission } from '../../../models/Permission';
import { RevisionEvent } from '../../../models/RevisionEvent';
import { PermissionContext } from '../../../services/PermissionContext';
import { WebLinkService } from '../../../services/WebLinkService';
import { WebLinkUpdateParams } from '../WebLinkUpdateParams';

export class ArtistUpdateParams {
	constructor(
		readonly id: number,
		readonly name: string,
		readonly artistType: ArtistType,
		readonly webLinks: WebLinkUpdateParams[],
	) {}

	static readonly schema = Joi.object<ArtistUpdateParams>({
		id: Joi.number().required(),
		name: Joi.string().required().trim().max(200),
		artistType: Joi.string()
			.required()
			.trim()
			.valid(...Object.values(ArtistType)),
		webLinks: Joi.array().items(WebLinkUpdateParams.schema).required(),
	});
}

export class ArtistUpdateCommand {
	constructor(
		readonly permissionContext: PermissionContext,
		readonly params: ArtistUpdateParams,
	) {}
}

@CommandHandler(ArtistUpdateCommand)
export class ArtistUpdateCommandHandler
	implements ICommandHandler<ArtistUpdateCommand>
{
	constructor(
		private readonly em: EntityManager,
		@InjectRepository(Artist)
		private readonly artistRepo: EntityRepository<Artist>,
		private readonly webLinkService: WebLinkService,
	) {}

	async execute(command: ArtistUpdateCommand): Promise<ArtistObject> {
		const { permissionContext, params } = command;

		permissionContext.verifyPermission(Permission.Artist_Update);

		const result = ArtistUpdateParams.schema.validate(params, {
			convert: true,
		});

		if (result.error)
			throw new BadRequestException(result.error.details[0].message);

		const isNew = params.id === 0;

		const artist = await this.em.transactional(async (em) => {
			const user = await permissionContext.getCurrentUser(em);

			const artist = isNew
				? new Artist()
				: await this.artistRepo.findOneOrFail(
						{
							id: params.id,
							deleted: false,
							hidden: false,
						},
						{ populate: true },
				  );

			em.persist(artist);

			const latestSnapshot = isNew ? undefined : artist.takeSnapshot();

			artist.name = params.name;
			artist.artistType = params.artistType;

			await this.webLinkService.sync(
				em,
				artist,
				params.webLinks,
				permissionContext,
				user,
			);

			const commit = new Commit();

			const revision = artist.createRevision({
				commit: commit,
				actor: user,
				event: isNew ? RevisionEvent.Created : RevisionEvent.Updated,
				summary: '',
			});

			if (revision.snapshot.contentEquals(latestSnapshot)) {
				throw new BadRequestException('Nothing has changed.');
			}

			em.persist(revision);

			const auditLogEntry = new ArtistAuditLogEntry({
				action: isNew
					? AuditedAction.Artist_Create
					: AuditedAction.Artist_Update,
				artist: artist,
				actor: user,
				actorIp: permissionContext.clientIp,
			});

			em.persist(auditLogEntry);

			return artist;
		});

		return new ArtistObject(
			artist,
			permissionContext,
			Object.values(ArtistOptionalField),
		);
	}
}
