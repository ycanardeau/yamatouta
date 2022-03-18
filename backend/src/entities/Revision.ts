import { Entity, Enum, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';

import { Entry } from '../models/Entry';
import { EntryType } from '../models/EntryType';
import { RevisionEvent } from '../models/RevisionEvent';
import { Snapshot, TranslationSnapshot } from '../models/Snapshot';
import { Commit } from './Commit';
import { Translation } from './Translation';
import { User } from './User';

// Schema from https://github.com/VocaDB/vocadb/blob/f10ec20c2cbc576c1572b41419620469b7872000/VocaDbModel/Domain/Versioning/ArchivedObjectVersion.cs.
// Thanks to @riipah (https://github.com/riipah).
@Entity({
	tableName: 'revisions',
	abstract: true,
	discriminatorColumn: 'entryType',
})
export abstract class Revision<
	TEntry extends Entry,
	TSnapshot extends Snapshot,
> {
	@PrimaryKey()
	id!: number;

	@ManyToOne()
	commit: Commit;

	@ManyToOne()
	actor: User;

	@Property()
	createdAt = new Date();

	@Property({ type: 'json' })
	snapshot: TSnapshot;

	@Property()
	deleted = false;

	@Property()
	hidden = false;

	@Property()
	summary: string;

	@Enum()
	event: RevisionEvent;

	@Property()
	version: number;

	protected constructor({
		commit,
		actor,
		snapshot,
		summary,
		event,
		version,
	}: {
		commit: Commit;
		actor: User;
		snapshot: TSnapshot;
		summary: string;
		event: RevisionEvent;
		version: number;
	}) {
		this.commit = commit;
		this.actor = actor;
		this.snapshot = snapshot;
		this.summary = summary;
		this.event = event;
		this.version = version;
	}

	abstract get entry(): TEntry;
}

@Entity({
	tableName: 'revisions',
	discriminatorValue: EntryType.Translation,
})
export class TranslationRevision extends Revision<
	Translation,
	TranslationSnapshot
> {
	@ManyToOne()
	translation: Translation;

	constructor({
		translation,
		...params
	}: {
		translation: Translation;
		commit: Commit;
		actor: User;
		snapshot: TranslationSnapshot;
		summary: string;
		event: RevisionEvent;
		version: number;
	}) {
		super(params);

		this.translation = translation;
	}

	get entry(): Translation {
		return this.translation;
	}
}
