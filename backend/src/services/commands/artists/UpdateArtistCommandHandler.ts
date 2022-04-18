import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';

import { ArtistObject } from '../../../dto/artists/ArtistObject';
import { Artist } from '../../../entities/Artist';
import { Commit } from '../../../entities/Commit';
import { User } from '../../../entities/User';
import { Permission } from '../../../models/Permission';
import { RevisionEvent } from '../../../models/RevisionEvent';
import {
	IUpdateArtistBody,
	updateArtistBodySchema,
} from '../../../requests/artists/IUpdateArtistBody';
import { AuditLogger } from '../../AuditLogger';
import { PermissionContext } from '../../PermissionContext';

@Injectable()
export class UpdateArtistCommandHandler {
	constructor(
		private readonly permissionContext: PermissionContext,
		private readonly em: EntityManager,
		@InjectRepository(User)
		private readonly userRepo: EntityRepository<User>,
		private readonly auditLogger: AuditLogger,
		@InjectRepository(Artist)
		private readonly artistRepo: EntityRepository<Artist>,
	) {}

	async execute(
		artistId: number,
		params: IUpdateArtistBody,
	): Promise<ArtistObject> {
		this.permissionContext.verifyPermission(Permission.EditArtists);

		const result = updateArtistBodySchema.validate(params, {
			convert: true,
		});

		if (result.error)
			throw new BadRequestException(result.error.details[0].message);

		const artist = await this.em.transactional(async (em) => {
			const user = await this.userRepo.findOneOrFail({
				id: this.permissionContext.user?.id,
				deleted: false,
				hidden: false,
			});

			const artist = await this.artistRepo.findOneOrFail({
				id: artistId,
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

			this.auditLogger.artist_update({
				actor: user,
				actorIp: this.permissionContext.remoteIpAddress,
				artist: artist,
			});

			return artist;
		});

		return new ArtistObject(artist, this.permissionContext);
	}
}
