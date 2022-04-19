import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';

import { ArtistObject } from '../../../dto/artists/ArtistObject';
import { Artist } from '../../../entities/Artist';
import { Commit } from '../../../entities/Commit';
import { User } from '../../../entities/User';
import { Permission } from '../../../models/Permission';
import { RevisionEvent } from '../../../models/RevisionEvent';
import { AuditLogger } from '../../../services/AuditLogger';
import { PermissionContext } from '../../../services/PermissionContext';
import { UpdateArtistCommand } from './UpdateArtistCommandHandler';

@Injectable()
export class CreateArtistCommandHandler {
	constructor(
		private readonly permissionContext: PermissionContext,
		private readonly em: EntityManager,
		@InjectRepository(User)
		private readonly userRepo: EntityRepository<User>,
		private readonly auditLogger: AuditLogger,
	) {}

	async execute(command: UpdateArtistCommand): Promise<ArtistObject> {
		this.permissionContext.verifyPermission(Permission.CreateArtists);

		const result = UpdateArtistCommand.schema.validate(command, {
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
				name: command.name,
				artistType: command.artistType,
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

			this.auditLogger.artist_create({
				actor: user,
				actorIp: this.permissionContext.remoteIpAddress,
				artist: artist,
			});

			return artist;
		});

		return new ArtistObject(artist, this.permissionContext);
	}
}
