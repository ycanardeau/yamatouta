import { Collection } from '@mikro-orm/core';

import { Revision } from '../entities/Revision';
import { Entry } from './Entry';
import { Snapshot } from './snapshots/Snapshot';

export interface IEntryWithRevisions<
	TEntry extends Entry,
	TRevision extends Revision<TEntry, TSnapshot>,
	TSnapshot extends Snapshot,
> {
	revisions: Collection<TRevision>;
	version: number;
}
