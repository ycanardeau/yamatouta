import { EntityManager } from '@mikro-orm/core';
import { BadRequestException, Injectable } from '@nestjs/common';
import _ from 'lodash';

import { Commit } from '../entities/Commit';
import { Revision } from '../entities/Revision';
import { User } from '../entities/User';
import { Entry } from '../models/Entry';
import { RevisionEvent } from '../models/RevisionEvent';
import { Snapshot } from '../models/snapshots/Snapshot';

@Injectable()
export class RevisionService {
	private async getLatestRevision(
		entry: Entry,
	): Promise<Revision<Entry, Snapshot> | undefined> {
		// FIXME: For some reason, this doesn't work in unit tests.
		// const revisions = await entry.revisions.matching({
		// 	where: { deleted: false },
		// 	orderBy: { version: QueryOrder.desc },
		// });
		//
		// return revisions[0] /* NOTE: Do not use .at(0) for now. */;

		const revisions = (await entry.revisions.loadItems()) as Revision<
			Entry,
			Snapshot
		>[];

		return _.chain(revisions)
			.filter((revision) => !revision.deleted)
			.orderBy((revision) => revision.version, 'desc')
			.value()[0] /* NOTE: Do not use .at(0) for now. */;
	}

	async create(
		em: EntityManager,
		entry: Entry,
		updateFunc: () => Promise<void>,
		actor: User,
		event: RevisionEvent,
		allowUnchanged: boolean,
	): Promise<void> {
		const isNew = !entry.id;

		// Take a snapshot before updating the entry.
		const latestSnapshot = isNew ? undefined : entry.takeSnapshot();

		if (!isNew) {
			// Create missing revisions.

			const latestRevision = await this.getLatestRevision(entry);

			if (!latestRevision) {
				// The initial revision is missing (e.g. imported from a file).

				if (entry.version !== 0)
					throw new Error('Something went wrong.');

				const initialCommit = new Commit();
				const actor = await entry.actor.load();

				const initialRevision = entry.createRevision(
					initialCommit,
					actor,
					RevisionEvent.Created,
					'',
					++entry.version,
				);
				initialRevision.createdAt = entry.createdAt;

				em.persist(initialRevision);
			} else if (
				latestSnapshot &&
				!latestSnapshot.contentEquals(
					JSON.parse(latestRevision.snapshot),
				)
			) {
				// The structure of snapshots classes has changed after the revision was created.

				const [commit, actor] = await Promise.all([
					latestRevision.commit.load(),
					latestRevision.actor.load(),
				]);

				// Create a new revision from the latest revision.
				const newRevision = entry.createRevision(
					// Use the same commit as `latestRevision`, because it can be seen as a single action.
					commit,
					actor,
					latestRevision.event,
					latestRevision.summary,
					// Use the same version number as `latestRevision`.
					latestRevision.version,
				);
				newRevision.createdAt = latestRevision.createdAt;

				em.persist(newRevision);

				// Mark the old revision as deleted.
				latestRevision.deleted = true;
			}
		}

		await updateFunc();

		const commit = new Commit();

		const revision = entry.createRevision(
			commit,
			actor,
			event,
			'',
			++entry.version,
		);

		if (
			!allowUnchanged &&
			latestSnapshot &&
			latestSnapshot.contentEquals(JSON.parse(revision.snapshot))
		) {
			throw new BadRequestException('Nothing has changed.');
		}

		em.persist(revision);
	}
}
