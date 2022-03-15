import { Entity, Enum, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';

import { ChangeLogChangeKey } from '../models/ChangeLogChangeKey';
import { EntryDiff } from '../models/EntryDiff';
import { ChangeLogEntry } from './ChangeLogEntry';

@Entity({ tableName: 'change_log_changes' })
export class ChangeLogChange {
	@PrimaryKey()
	id!: number;

	@ManyToOne(() => ChangeLogEntry)
	changeLogEntry: ChangeLogEntry<EntryDiff>;

	@Enum()
	key: ChangeLogChangeKey;

	@Property({ columnType: 'text' })
	value: string;

	constructor({
		changeLogEntry,
		key,
		value,
	}: {
		changeLogEntry: ChangeLogEntry<EntryDiff>;
		key: ChangeLogChangeKey;
		value: string;
	}) {
		this.changeLogEntry = changeLogEntry;
		this.key = key;
		this.value = value;
	}
}
