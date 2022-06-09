import { Collection } from '@mikro-orm/core';

import { Revision } from '../entities/Revision';
import { Entry } from './Entry';
import { Snapshot } from './snapshots/Snapshot';

export interface IEntryWithRevisions<
	TEntry extends Entry,
	TSnapshot extends Snapshot,
	TRevision extends Revision<TEntry, TSnapshot>,
> {
	revisions: Collection<TRevision>;
	version: number;
}
