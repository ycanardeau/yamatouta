import { Collection } from '@mikro-orm/core';

import { Commit } from '../entities/Commit';
import { Revision } from '../entities/Revision';
import { User } from '../entities/User';
import { EntryWithRevisions } from './Entry';
import { RevisionEvent } from './RevisionEvent';
import { Snapshot } from './snapshots/Snapshot';

export interface IEntryWithRevisions<
	TEntry extends EntryWithRevisions,
	TSnapshot extends Snapshot,
	TRevision extends Revision<TEntry, TSnapshot>,
> {
	version: number;
	revisions: Collection<TRevision>;

	takeSnapshot(): TSnapshot;

	createRevision(
		commit: Commit,
		actor: User,
		event: RevisionEvent,
		summary: string,
		version: number,
	): TRevision;
}
