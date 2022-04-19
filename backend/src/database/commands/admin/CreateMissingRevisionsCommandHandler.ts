import { EntityManager } from '@mikro-orm/core';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { Artist } from '../../../entities/Artist';
import { Commit } from '../../../entities/Commit';
import { Quote } from '../../../entities/Quote';
import { Translation } from '../../../entities/Translation';
import { User } from '../../../entities/User';
import { Entry } from '../../../models/Entry';
import { Permission } from '../../../models/Permission';
import { RevisionEvent } from '../../../models/RevisionEvent';
import { PermissionContext } from '../../../services/PermissionContext';

export class CreateMissingRevisionsCommand {
	constructor(readonly permissionContext: PermissionContext) {}
}

@CommandHandler(CreateMissingRevisionsCommand)
export class CreateMissingRevisionsCommandHandler
	implements ICommandHandler<CreateMissingRevisionsCommand>
{
	constructor(private readonly em: EntityManager) {}

	execute(command: CreateMissingRevisionsCommand): Promise<void> {
		command.permissionContext.verifyPermission(
			Permission.CreateMissingRevisions,
		);

		return this.em.transactional(async (em) => {
			const user = await em.findOneOrFail(User, {
				id: command.permissionContext.user?.id,
				deleted: false,
				hidden: false,
			});

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

				const revision = entry.createRevision({
					commit: commit,
					actor: user,
					event: RevisionEvent.Created,
					summary: '',
				});
				revision.createdAt = entry.createdAt;

				em.persist(revision);
			}
		});
	}
}