import { BadRequestException, Injectable } from '@nestjs/common';

import { Commit } from '../entities/Commit';
import { Revision } from '../entities/Revision';
import { User } from '../entities/User';
import { Entry } from '../models/Entry';
import { IEntryWithRevisions } from '../models/IEntryWithRevisions';
import { IRevisionFactory } from '../models/IRevisionFactory';
import { RevisionEvent } from '../models/RevisionEvent';
import { Snapshot } from '../models/snapshots/Snapshot';

@Injectable()
export class RevisionService {
	constructor() {}

	async create<
		TEntry extends Entry,
		TRevision extends Revision<TEntry, TSnapshot>,
		TSnapshot extends Snapshot,
	>(
		entry: { id: number } & IEntryWithRevisions<
			TEntry,
			TRevision,
			TSnapshot
		> &
			IRevisionFactory<TEntry, TRevision, TSnapshot>,
		updateFunc: () => Promise<void>,
		user: User,
	): Promise<Revision<TEntry, TSnapshot>> {
		const isNew = !entry.id;

		// Take a snapshot before updating the entry.
		const latestSnapshot = isNew ? undefined : entry.takeSnapshot();

		await updateFunc();

		const commit = new Commit();

		const revision = entry.createRevision(
			commit,
			user,
			isNew ? RevisionEvent.Created : RevisionEvent.Updated,
			'',
			++entry.version,
		);

		if (latestSnapshot?.contentEquals(JSON.parse(revision.snapshot))) {
			throw new BadRequestException('Nothing has changed.');
		}

		return revision;
	}
}
