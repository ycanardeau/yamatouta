import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';

import { ArtistObject } from '../../dto/artists/ArtistObject';
import { Artist } from '../../entities/Artist';
import { Commit } from '../../entities/Commit';
import { User } from '../../entities/User';
import { Permission } from '../../models/Permission';
import { RevisionEvent } from '../../models/RevisionEvent';
import {
	IUpdateArtistBody,
	updateArtistBodySchema,
} from '../../requests/artists/IUpdateArtistBody';
import { AuditLogService } from '../AuditLogService';
import { PermissionContext } from '../PermissionContext';

@Injectable()
export class CreateArtistService {
	constructor(
		private readonly permissionContext: PermissionContext,
		private readonly em: EntityManager,
		@InjectRepository(User)
		private readonly userRepo: EntityRepository<User>,
		private readonly auditLogService: AuditLogService,
	) {}

	async createArtist(params: IUpdateArtistBody): Promise<ArtistObject> {
		this.permissionContext.verifyPermission(Permission.CreateArtists);

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

			const artist = new Artist({
				name: params.name,
				artistType: params.artistType,
			});

			em.persist(artist);

			const commit = new Commit();

			const revision = artist.createRevision({
				commit: commit,
				actor: user,
				event: RevisionEvent.Created,
				summary: '',
			});

			em.persist(revision);

			this.auditLogService.artist_create({
				actor: user,
				actorIp: this.permissionContext.remoteIpAddress,
				artist: artist,
			});

			return artist;
		});

		return new ArtistObject(artist, this.permissionContext);
	}
}
