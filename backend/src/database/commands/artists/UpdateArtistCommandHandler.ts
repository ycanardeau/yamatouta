import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import Joi from 'joi';

import { WebLinkObject } from '../../../dto/WebLinkObject';
import { ArtistObject } from '../../../dto/artists/ArtistObject';
import { Artist } from '../../../entities/Artist';
import { Commit } from '../../../entities/Commit';
import { User } from '../../../entities/User';
import { ArtistOptionalFields } from '../../../models/ArtistOptionalFields';
import { ArtistType } from '../../../models/ArtistType';
import { Permission } from '../../../models/Permission';
import { RevisionEvent } from '../../../models/RevisionEvent';
import { AuditLogEntryFactory } from '../../../services/AuditLogEntryFactory';
import { PermissionContext } from '../../../services/PermissionContext';
import { WebAddressFactory } from '../../../services/WebAddressFactory';
import { syncWebLinks } from '../entries/syncWebLinks';

export class UpdateArtistParams {
	static readonly schema = Joi.object<UpdateArtistParams>({
		artistId: Joi.number().optional(),
		name: Joi.string().required().trim().max(200),
		artistType: Joi.string()
			.required()
			.trim()
			.valid(...Object.values(ArtistType)),
		webLinks: Joi.array().items(WebLinkObject.schema).required(),
	});

	constructor(
		readonly artistId: number | undefined,
		readonly name: string,
		readonly artistType: ArtistType,
		readonly webLinks: WebLinkObject[],
	) {}
}

export class UpdateArtistCommand {
	constructor(
		readonly permissionContext: PermissionContext,
		readonly params: UpdateArtistParams,
	) {}
}

@CommandHandler(UpdateArtistCommand)
export class UpdateArtistCommandHandler
	implements ICommandHandler<UpdateArtistCommand>
{
	constructor(
		private readonly em: EntityManager,
		@InjectRepository(User)
		private readonly userRepo: EntityRepository<User>,
		private readonly auditLogEntryFactory: AuditLogEntryFactory,
		@InjectRepository(Artist)
		private readonly artistRepo: EntityRepository<Artist>,
		private readonly webAddressFactory: WebAddressFactory,
	) {}

	async execute(command: UpdateArtistCommand): Promise<ArtistObject> {
		const { permissionContext, params } = command;

		permissionContext.verifyPermission(Permission.EditArtists);

		const result = UpdateArtistParams.schema.validate(params, {
			convert: true,
		});

		if (result.error)
			throw new BadRequestException(result.error.details[0].message);

		const artist = await this.em.transactional(async (em) => {
			const user = await this.userRepo.findOneOrFail({
				id: permissionContext.user?.id,
				deleted: false,
				hidden: false,
			});

			const artist = await this.artistRepo.findOneOrFail(
				{
					id: params.artistId,
					deleted: false,
					hidden: false,
				},
				{ populate: true },
			);

			const latestSnapshot = artist.takeSnapshot();

			artist.name = params.name;
			artist.artistType = params.artistType;

			await syncWebLinks(
				em,
				artist,
				params.webLinks,
				permissionContext,
				this.webAddressFactory,
				user,
			);

			const commit = new Commit();

			const revision = artist.createRevision({
				commit: commit,
				actor: user,
				event: RevisionEvent.Updated,
				summary: '',
			});

			if (revision.snapshot.contentEquals(latestSnapshot)) {
				throw new BadRequestException('Nothing has changed.');
			}

			em.persist(revision);

			const auditLogEntry = this.auditLogEntryFactory.artist_update({
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
			Object.values(ArtistOptionalFields),
		);
	}
}
