import { Collection, Entity, OneToMany, PrimaryKey } from '@mikro-orm/core';

import { ChangeLogEntry } from './ChangeLogEntry';

@Entity({ tableName: 'revisions' })
export class Revision {
	@PrimaryKey()
	id!: number;

	@OneToMany(
		() => ChangeLogEntry,
		(changeLogEntry) => changeLogEntry.revision,
	)
	changeLogEntries = new Collection<ChangeLogEntry>(this);
}
