import { Revision } from '../entities/Revision';
import { User } from '../entities/User';
import { Entry } from './Entry';
import { RevisionEvent } from './RevisionEvent';
import { Snapshot } from './Snapshot';

export interface IRevisionFactory<
	TEntry extends Entry,
	TRevision extends Revision<TEntry, TSnapshot>,
	TSnapshot extends Snapshot,
> {
	createRevision({}: {
		actor: User;
		event: RevisionEvent;
		summary: string;
	}): TRevision;
}