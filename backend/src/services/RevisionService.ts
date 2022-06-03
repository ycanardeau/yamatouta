import { BadRequestException, Injectable } from '@nestjs/common';

import { Commit } from '../entities/Commit';
import { Revision } from '../entities/Revision';
import { User } from '../entities/User';
import { Entry } from '../models/Entry';
import { RevisionEvent } from '../models/RevisionEvent';
import { Snapshot } from '../models/snapshots/Snapshot';

@Injectable()
export class RevisionService {
	constructor() {}

	async create(
		entry: Entry,
		updateFunc: () => Promise<void>,
		user: User,
		event: RevisionEvent,
		allowUnchanged: boolean,
	): Promise<Revision<Entry, Snapshot>> {
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

		return revision;
	}
}
