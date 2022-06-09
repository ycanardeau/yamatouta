import { Commit } from '../entities/Commit';
import { Revision } from '../entities/Revision';
import { User } from '../entities/User';
import { Entry } from './Entry';
import { RevisionEvent } from './RevisionEvent';
import { Snapshot } from './snapshots/Snapshot';

export interface IRevisionFactory<
	TEntry extends Entry,
	TSnapshot extends Snapshot,
	TRevision extends Revision<TEntry, TSnapshot>,
> {
	takeSnapshot(): TSnapshot;

	createRevision(
		commit: Commit,
		actor: User,
		event: RevisionEvent,
		summary: string,
		version: number,
	): TRevision;
}
