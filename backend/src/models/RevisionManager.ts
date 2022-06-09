import { Collection } from '@mikro-orm/core';

import { Revision } from '../entities/Revision';
import { Entry } from './Entry';
import { IEntryWithRevisions } from './IEntryWithRevisions';
import { Snapshot } from './snapshots/Snapshot';

// Code from https://github.com/VocaDB/vocadb/blob/05c2737b6a26d57613dbb9ee50271b7756dc81da/VocaDbModel/Domain/Versioning/ArchivedVersionManager.cs.
export class RevisionManager<
	TEntry extends Entry,
	TSnapshot extends Snapshot,
	TRevision extends Revision<TEntry, TSnapshot>,
> {
	constructor(
		private readonly entry: IEntryWithRevisions<
			TEntry,
			TSnapshot,
			TRevision
		>,
	) {}

	get revisions(): Collection<TRevision> {
		return this.entry.revisions;
	}
}
