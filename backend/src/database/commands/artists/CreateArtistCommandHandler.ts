import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ArtistObject } from '../../../dto/artists/ArtistObject';
import { Artist } from '../../../entities/Artist';
import { Commit } from '../../../entities/Commit';
import { User } from '../../../entities/User';
import { Permission } from '../../../models/Permission';
import { RevisionEvent } from '../../../models/RevisionEvent';
import { AuditLogEntryFactory } from '../../../services/AuditLogEntryFactory';
import { PermissionContext } from '../../../services/PermissionContext';
import { UpdateArtistCommand } from './UpdateArtistCommandHandler';

export class CreateArtistCommand extends UpdateArtistCommand {}

@CommandHandler(CreateArtistCommand)
export class CreateArtistCommandHandler
	implements ICommandHandler<CreateArtistCommand>
{
	constructor(
		private readonly permissionContext: PermissionContext,
		private readonly em: EntityManager,
		@InjectRepository(User)
		private readonly userRepo: EntityRepository<User>,
		private readonly auditLogEntryFactory: AuditLogEntryFactory,
	) {}

	async execute(command: CreateArtistCommand): Promise<ArtistObject> {
		this.permissionContext.verifyPermission(Permission.CreateArtists);

		const result = CreateArtistCommand.schema.validate(command, {
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

			const auditLogEntry = this.auditLogEntryFactory.artist_create({
				artist: artist,
				actor: user,
				actorIp: this.permissionContext.clientIp,
			});

			em.persist(auditLogEntry);

			return artist;
		});

		return new ArtistObject(artist, this.permissionContext);
	}
}
