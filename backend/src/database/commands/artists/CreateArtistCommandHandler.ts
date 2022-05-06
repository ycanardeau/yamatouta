import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ArtistObject } from '../../../dto/artists/ArtistObject';
import { Artist } from '../../../entities/Artist';
import { Commit } from '../../../entities/Commit';
import { User } from '../../../entities/User';
import { ArtistOptionalFields } from '../../../models/ArtistOptionalFields';
import { Permission } from '../../../models/Permission';
import { RevisionEvent } from '../../../models/RevisionEvent';
import { AuditLogEntryFactory } from '../../../services/AuditLogEntryFactory';
import { PermissionContext } from '../../../services/PermissionContext';
import { UpdateArtistParams } from './UpdateArtistCommandHandler';

export class CreateArtistCommand {
	constructor(
		readonly permissionContext: PermissionContext,
		readonly params: UpdateArtistParams,
	) {}
}

@CommandHandler(CreateArtistCommand)
export class CreateArtistCommandHandler
	implements ICommandHandler<CreateArtistCommand>
{
	constructor(
		private readonly em: EntityManager,
		@InjectRepository(User)
		private readonly userRepo: EntityRepository<User>,
		private readonly auditLogEntryFactory: AuditLogEntryFactory,
	) {}

	async execute(command: CreateArtistCommand): Promise<ArtistObject> {
		const { permissionContext, params } = command;

		command.permissionContext.verifyPermission(Permission.CreateArtists);

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

			const auditLogEntry = this.auditLogEntryFactory.artist_create({
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
