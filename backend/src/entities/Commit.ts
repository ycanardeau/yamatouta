import { Collection, Entity, OneToMany, PrimaryKey } from '@mikro-orm/core';

import { Entry } from '../models/Entry';
import { Snapshot } from '../models/Snapshot';
import { Revision } from './Revision';

// At times, more than one type of history record can be recorded by a single action.
// All of these will be grouped using the same `Commit`.
// This can be compared to Stack Overflow's `RevisionGUID`.
// See also https://meta.stackexchange.com/a/2678.
@Entity({ tableName: 'commits' })
export class Commit {
	@PrimaryKey()
	id!: number;

	@OneToMany(() => Revision, (revision) => revision.commit)
	revisions = new Collection<Revision<Entry, Snapshot>>(this);
}
