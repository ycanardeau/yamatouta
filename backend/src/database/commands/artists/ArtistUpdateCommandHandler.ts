import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ArtistObject } from '../../../dto/ArtistObject';
import { Artist } from '../../../entities/Artist';
import { ArtistAuditLogEntry } from '../../../entities/AuditLogEntry';
import { AuditedAction } from '../../../models/AuditedAction';
import { Permission } from '../../../models/Permission';
import { RevisionEvent } from '../../../models/RevisionEvent';
import { ArtistOptionalField } from '../../../models/artists/ArtistOptionalField';
import { ArtistUpdateParams } from '../../../models/artists/ArtistUpdateParams';
import { NgramConverter } from '../../../services/NgramConverter';
import { PermissionContext } from '../../../services/PermissionContext';
import { RevisionService } from '../../../services/RevisionService';
import { WebLinkService } from '../../../services/WebLinkService';

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
	static readonly populate = [
		'searchIndex',
		'webLinks',
		'webLinks.address',
		'webLinks.address.host',
	] as const;

	constructor(
		private readonly em: EntityManager,
		@InjectRepository(Artist)
		private readonly artistRepo: EntityRepository<Artist>,
		private readonly webLinkService: WebLinkService,
		private readonly revisionService: RevisionService,
		private readonly ngramConverter: NgramConverter,
	) {}

	async execute(command: ArtistUpdateCommand): Promise<ArtistObject> {
		const { permissionContext, params } = command;

		permissionContext.verifyPermission(Permission.UpdateArtists);

		const result = ArtistUpdateParams.schema.validate(params, {
			convert: true,
		});

		if (result.error)
			throw new BadRequestException(result.error.details[0].message);

		const isNew = params.id === 0;

		const artist = await this.em.transactional(async (em) => {
			const actor = await permissionContext.getCurrentUser(em);

			const artist = isNew
				? new Artist(actor)
				: await this.artistRepo.findOneOrFail(
						{
							id: params.id,
							deleted: false,
							hidden: false,
						},
						{ populate: ArtistUpdateCommandHandler.populate },
				  );

			em.persist(artist);

			await this.revisionService.create(
				em,
				artist,
				async () => {
					artist.name = params.name;
					artist.artistType = params.artistType;

					artist.updateSearchIndex(this.ngramConverter);

					await this.webLinkService.sync(
						em,
						artist,
						params.webLinks,
						permissionContext,
						actor,
					);
				},
				actor,
				isNew ? RevisionEvent.Created : RevisionEvent.Updated,
				false,
			);

			const auditLogEntry = new ArtistAuditLogEntry({
				action: isNew
					? AuditedAction.Artist_Create
					: AuditedAction.Artist_Update,
				artist: artist,
				actor: actor,
				actorIp: permissionContext.clientIp,
			});

			em.persist(auditLogEntry);

			return artist;
		});

		return ArtistObject.create(
			artist,
			permissionContext,
			Object.values(ArtistOptionalField),
		);
	}
}
