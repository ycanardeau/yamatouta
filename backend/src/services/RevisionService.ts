import { EntityManager } from '@mikro-orm/core';
import { BadRequestException, Injectable } from '@nestjs/common';

import { Commit } from '../entities/Commit';
import { User } from '../entities/User';
import { Entry } from '../models/Entry';
import { RevisionEvent } from '../models/RevisionEvent';

@Injectable()
export class RevisionService {
	constructor() {}

	async create(
		em: EntityManager,
		entry: Entry,
		updateFunc: () => Promise<void>,
		user: User,
		event: RevisionEvent,
		allowUnchanged: boolean,
	): Promise<void> {
		const isNew = !entry.id;

		// Take a snapshot before updating the entry.
		const latestSnapshot = isNew ? undefined : entry.takeSnapshot();

		await updateFunc();

		const commit = new Commit();

		const revision = entry.createRevision(
			commit,
			user,
			event,
			'',
			++entry.version,
		);

		if (
			!allowUnchanged &&
			latestSnapshot?.contentEquals(JSON.parse(revision.snapshot))
		) {
			throw new BadRequestException('Nothing has changed.');
		}

		em.persist(revision);
	}
}
