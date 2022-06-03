import { Entity, Enum, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';

import { Entry } from '../models/Entry';
import { EntryType } from '../models/EntryType';
import { RevisionEvent } from '../models/RevisionEvent';
import { ArtistSnapshot } from '../models/snapshots/ArtistSnapshot';
import { QuoteSnapshot } from '../models/snapshots/QuoteSnapshot';
import { Snapshot } from '../models/snapshots/Snapshot';
import { TranslationSnapshot } from '../models/snapshots/TranslationSnapshot';
import { WorkSnapshot } from '../models/snapshots/WorkSnapshot';
import { Artist } from './Artist';
import { Commit } from './Commit';
import { Quote } from './Quote';
import { Translation } from './Translation';
import { User } from './User';
import { Work } from './Work';

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

	@Property({ columnType: 'text' })
	snapshot: string;

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
		this.snapshot = JSON.stringify(snapshot);
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

@Entity({ tableName: 'revisions', discriminatorValue: EntryType.Artist })
export class ArtistRevision extends Revision<Artist, ArtistSnapshot> {
	@ManyToOne()
	artist: Artist;

	constructor({
		artist,
		...params
	}: {
		artist: Artist;
		commit: Commit;
		actor: User;
		snapshot: ArtistSnapshot;
		summary: string;
		event: RevisionEvent;
		version: number;
	}) {
		super(params);

		this.artist = artist;
	}

	get entry(): Artist {
		return this.artist;
	}
}

@Entity({ tableName: 'revisions', discriminatorValue: EntryType.Quote })
export class QuoteRevision extends Revision<Quote, QuoteSnapshot> {
	@ManyToOne()
	quote: Quote;

	constructor({
		quote,
		...params
	}: {
		quote: Quote;
		commit: Commit;
		actor: User;
		snapshot: QuoteSnapshot;
		summary: string;
		event: RevisionEvent;
		version: number;
	}) {
		super(params);

		this.quote = quote;
	}

	get entry(): Quote {
		return this.quote;
	}
}

@Entity({ tableName: 'revisions', discriminatorValue: EntryType.Work })
export class WorkRevision extends Revision<Work, WorkSnapshot> {
	@ManyToOne()
	work: Work;

	constructor({
		work,
		...params
	}: {
		work: Work;
		commit: Commit;
		actor: User;
		snapshot: WorkSnapshot;
		summary: string;
		event: RevisionEvent;
		version: number;
	}) {
		super(params);

		this.work = work;
	}

	get entry(): Work {
		return this.work;
	}
}
