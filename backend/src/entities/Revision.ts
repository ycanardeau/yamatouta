import { Collection, Entity, OneToMany, PrimaryKey } from '@mikro-orm/core';

import { ChangeLogEvent } from '../models/ChangeLogEvent';
import { EntryDiff } from '../models/EntryDiff';
import { IEntryWithChangeLogEntries } from '../models/IEntryWithChangeLogEntries';
import { ChangeLogEntry } from './ChangeLogEntry';
import { User } from './User';

@Entity({ tableName: 'revisions' })
export class Revision {
	@PrimaryKey()
	id!: number;

	@OneToMany(
		() => ChangeLogEntry,
		(changeLogEntry) => changeLogEntry.revision,
	)
	changeLogEntries = new Collection<ChangeLogEntry<EntryDiff>>(this);

	addChangeLogEntry<TEntryDiff extends EntryDiff>({
		entry,
		actor,
		actionType,
		text,
		diff,
	}: {
		entry: IEntryWithChangeLogEntries<TEntryDiff>;
		actor: User;
		actionType: ChangeLogEvent;
		text: string;
		diff: TEntryDiff;
	}): void {
		const changeLogEntry = entry
			.createChangeLogEntry({
				revision: this,
				actor: actor,
				actionType: actionType,
				text: text,
			})
			.addChanges(diff);

		this.changeLogEntries.add(changeLogEntry);
	}
}
