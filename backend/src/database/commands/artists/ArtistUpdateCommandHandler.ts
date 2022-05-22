import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import Joi from 'joi';

import { ArtistObject } from '../../../dto/ArtistObject';
import { WebLinkObject } from '../../../dto/WebLinkObject';
import { Artist } from '../../../entities/Artist';
import { ArtistAuditLogEntry } from '../../../entities/AuditLogEntry';
import { Commit } from '../../../entities/Commit';
import { User } from '../../../entities/User';
import { ArtistOptionalField } from '../../../models/ArtistOptionalField';
import { ArtistType } from '../../../models/ArtistType';
import { AuditedAction } from '../../../models/AuditedAction';
import { Permission } from '../../../models/Permission';
import { RevisionEvent } from '../../../models/RevisionEvent';
import { PermissionContext } from '../../../services/PermissionContext';
import { WebAddressFactory } from '../../../services/WebAddressFactory';
import { syncWebLinks } from '../entries/syncWebLinks';

export class ArtistUpdateParams {
	static readonly schema = Joi.object<ArtistUpdateParams>({
		id: Joi.number().required(),
		name: Joi.string().required().trim().max(200),
		artistType: Joi.string()
			.required()
			.trim()
			.valid(...Object.values(ArtistType)),
		webLinks: Joi.array().items(WebLinkObject.schema).required(),
	});

	constructor(
		readonly id: number,
		readonly name: string,
		readonly artistType: ArtistType,
		readonly webLinks: WebLinkObject[],
	) {}
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
		@InjectRepository(User)
		private readonly userRepo: EntityRepository<User>,
		@InjectRepository(Artist)
		private readonly artistRepo: EntityRepository<Artist>,
		private readonly webAddressFactory: WebAddressFactory,
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
			const user = await this.userRepo.findOneOrFail({
				id: permissionContext.user?.id,
				deleted: false,
				hidden: false,
			});

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
