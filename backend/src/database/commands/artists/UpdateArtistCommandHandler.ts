import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import Joi from 'joi';

import { ArtistObject } from '../../../dto/artists/ArtistObject';
import { Artist } from '../../../entities/Artist';
import { Commit } from '../../../entities/Commit';
import { User } from '../../../entities/User';
import { ArtistType } from '../../../models/ArtistType';
import { Permission } from '../../../models/Permission';
import { RevisionEvent } from '../../../models/RevisionEvent';
import { AuditLogEntryFactory } from '../../../services/AuditLogEntryFactory';
import { PermissionContext } from '../../../services/PermissionContext';

export class UpdateArtistParams {
	static readonly schema = Joi.object<UpdateArtistParams>({
		artistId: Joi.number().optional(),
		name: Joi.string().required().trim().max(200),
		artistType: Joi.string()
			.required()
			.trim()
			.valid(...Object.values(ArtistType)),
	});

	constructor(
		readonly artistId: number | undefined,
		readonly name: string,
		readonly artistType: ArtistType,
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

			const artist = await this.artistRepo.findOneOrFail({
				id: params.artistId,
				deleted: false,
				hidden: false,
			});

			artist.name = params.name;
			artist.artistType = params.artistType;

			const commit = new Commit();

			const revision = artist.createRevision({
				commit: commit,
				actor: user,
				event: RevisionEvent.Updated,
				summary: '',
			});

			em.persist(revision);

			const auditLogEntry = this.auditLogEntryFactory.artist_update({
				artist: artist,
				actor: user,
				actorIp: permissionContext.clientIp,
			});

			em.persist(auditLogEntry);

			return artist;
		});

		return new ArtistObject(artist, permissionContext);
	}
}
