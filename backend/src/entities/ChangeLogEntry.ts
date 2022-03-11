import {
	Collection,
	Entity,
	Enum,
	IdentifiedReference,
	ManyToOne,
	OneToMany,
	PrimaryKey,
	Property,
	Reference,
} from '@mikro-orm/core';

import { ChangeLogChangeKey } from '../models/ChangeLogChangeKey';
import { ChangeLogEvent } from '../models/ChangeLogEvent';
import { EntryDiff, TranslationDiff } from '../models/EntryDiff';
import { EntryType } from '../models/EntryType';
import { ChangeLogChange } from './ChangeLogChange';
import { Revision } from './Revision';
import { Translation } from './Translation';
import { User } from './User';

@Entity({
	tableName: 'change_log_entries',
	abstract: true,
	discriminatorColumn: 'entryType',
})
export abstract class ChangeLogEntry<TEntryDiff extends EntryDiff> {
	@PrimaryKey()
	id!: number;

	@Property()
	createdAt = new Date();

	@ManyToOne(() => Revision, { wrappedReference: true })
	revision: IdentifiedReference<Revision>;

	@OneToMany(() => ChangeLogChange, (change) => change.changeLogEntry)
	changes = new Collection<ChangeLogChange>(this);

	@ManyToOne()
	actor: User;

	@Enum()
	actionType: ChangeLogEvent;

	@Property({ columnType: 'text' })
	text: string;

	@Enum()
	entryType!: EntryType;

	protected constructor({
		revision,
		actor,
		actionType,
		text,
	}: {
		revision: Revision;
		actor: User;
		actionType: ChangeLogEvent;
		text: string;
	}) {
		this.revision = Reference.create(revision);
		this.actor = actor;
		this.actionType = actionType;
		this.text = text;
	}

	abstract get entry(): { id: number };

	createChange({
		key,
		value,
	}: {
		key: ChangeLogChangeKey;
		value: string;
	}): ChangeLogChange {
		return new ChangeLogChange({
			changeLogEntry: this,
			key: key,
			value: value,
		});
	}

	addChanges(diff: TEntryDiff): ChangeLogEntry<TEntryDiff> {
		this.changes.add(
			...Object.entries(diff)
				.filter(([, value]) => value !== undefined)
				.map(([key, value]) =>
					this.createChange({
						key: key as ChangeLogChangeKey,
						value: value as string,
					}),
				),
		);

		return this;
	}
}

@Entity({
	tableName: 'change_log_entries',
	discriminatorValue: EntryType.Translation,
})
export class TranslationChangeLogEntry extends ChangeLogEntry<TranslationDiff> {
	@ManyToOne()
	translation: Translation;

	constructor({
		revision,
		actor,
		actionType,
		text,
		translation,
	}: {
		revision: Revision;
		actor: User;
		actionType: ChangeLogEvent;
		text: string;
		translation: Translation;
	}) {
		super({ revision, actor, actionType, text });

		this.translation = translation;
	}

	get entry(): { id: number } {
		return this.translation;
	}
}
