import { EntityManager } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';

import { Artist } from '../../entities/Artist';
import { Commit } from '../../entities/Commit';
import { Quote } from '../../entities/Quote';
import { Translation } from '../../entities/Translation';
import { User } from '../../entities/User';
import { Entry } from '../../models/Entry';
import { Permission } from '../../models/Permission';
import { RevisionEvent } from '../../models/RevisionEvent';
import { PermissionContext } from '../PermissionContext';

@Injectable()
export class CreateMissingRevisionsService {
	constructor(
		private readonly permissionContext: PermissionContext,
		private readonly em: EntityManager,
	) {}

	execute(): Promise<void> {
		this.permissionContext.verifyPermission(
			Permission.CreateMissingRevisions,
		);

		return this.em.transactional(async (em) => {
			const user = await this.em.findOneOrFail(User, {
				id: this.permissionContext.user?.id,
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
