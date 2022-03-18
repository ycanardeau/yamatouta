import { Collection, QueryOrder } from '@mikro-orm/core';

import { Revision } from '../entities/Revision';
import { Entry } from './Entry';
import { IEntryWithRevisions } from './IEntryWithRevisions';
import { Snapshot } from './Snapshot';

// Code from https://github.com/VocaDB/vocadb/blob/05c2737b6a26d57613dbb9ee50271b7756dc81da/VocaDbModel/Domain/Versioning/ArchivedVersionManager.cs.
export class RevisionManager<
	TEntry extends Entry,
	TRevision extends Revision<TEntry, TSnapshot>,
	TSnapshot extends Snapshot,
> {
	constructor(
		private readonly entry: IEntryWithRevisions<
			TEntry,
			TRevision,
			TSnapshot
		>,
	) {}

	get revisions(): Collection<TRevision> {
		return this.entry.revisions;
	}

	async getLatestRevision(): Promise<TRevision | undefined> {
		return (
			await this.revisions.matching({
				orderBy: { version: QueryOrder.DESC },
			})
		).at(0);
	}
}
