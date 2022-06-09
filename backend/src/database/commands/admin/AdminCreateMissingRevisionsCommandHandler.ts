import { EntityManager } from '@mikro-orm/core';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Artist } from '../../../entities/Artist';
import { Commit } from '../../../entities/Commit';
import { Quote } from '../../../entities/Quote';
import { Translation } from '../../../entities/Translation';
import { Entry } from '../../../models/Entry';
import { Permission } from '../../../models/Permission';
import { RevisionEvent } from '../../../models/RevisionEvent';
import { PermissionContext } from '../../../services/PermissionContext';

export class AdminCreateMissingRevisionsCommand {
	constructor(readonly permissionContext: PermissionContext) {}
}

@CommandHandler(AdminCreateMissingRevisionsCommand)
export class AdminCreateMissingRevisionsCommandHandler
	implements ICommandHandler<AdminCreateMissingRevisionsCommand>
{
	constructor(private readonly em: EntityManager) {}

	execute(command: AdminCreateMissingRevisionsCommand): Promise<void> {
		const { permissionContext } = command;

		permissionContext.verifyPermission(Permission.CreateMissingRevisions);

		return this.em.transactional(async (em) => {
			const actor = await permissionContext.getCurrentUser(em);

			const [translations, artists, quotes] = await Promise.all([
				em.find(Translation, { version: 0 }),
				em.find(Artist, { version: 0 }),
				em.find(Quote, { version: 0 }),
			]);

			const entries = ([] as Entry[])
				.concat(translations)
				.concat(artists)
				.concat(quotes);

			for (const entry of entries) {
				const commit = new Commit();

				const revision = entry.createRevision(
					commit,
					actor,
					RevisionEvent.Created,
					'',
					++entry.version,
				);
				revision.createdAt = entry.createdAt;

				em.persist(revision);
			}
		});
	}
}
