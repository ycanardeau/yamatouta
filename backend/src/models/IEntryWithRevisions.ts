import { Commit } from '@/entities/Commit';
import { Revision } from '@/entities/Revision';
import { User } from '@/entities/User';
import { EntryWithRevisions } from '@/models/Entry';
import { RevisionEvent } from '@/models/RevisionEvent';
import { Snapshot } from '@/models/snapshots/Snapshot';
import { Collection } from '@mikro-orm/core';

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
