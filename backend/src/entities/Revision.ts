import {
	Entity,
	Enum,
	IdentifiedReference,
	ManyToOne,
	PrimaryKey,
	Property,
	Reference,
} from '@mikro-orm/core';

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
	commit: IdentifiedReference<Commit>;

	@ManyToOne()
	actor: IdentifiedReference<User>;

	@Property()
	createdAt = new Date();

	@Property({ onUpdate: () => new Date() })
	updatedAt = new Date();

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
		this.commit = Reference.create(commit);
		this.actor = Reference.create(actor);
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
	translation: IdentifiedReference<Translation>;

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

		this.translation = Reference.create(translation);
	}

	get entry(): Translation {
		return this.translation.getEntity();
	}
}

@Entity({ tableName: 'revisions', discriminatorValue: EntryType.Artist })
export class ArtistRevision extends Revision<Artist, ArtistSnapshot> {
	@ManyToOne()
	artist: IdentifiedReference<Artist>;

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

		this.artist = Reference.create(artist);
	}

	get entry(): Artist {
		return this.artist.getEntity();
	}
}

@Entity({ tableName: 'revisions', discriminatorValue: EntryType.Quote })
export class QuoteRevision extends Revision<Quote, QuoteSnapshot> {
	@ManyToOne()
	quote: IdentifiedReference<Quote>;

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

		this.quote = Reference.create(quote);
	}

	get entry(): Quote {
		return this.quote.getEntity();
	}
}

@Entity({ tableName: 'revisions', discriminatorValue: EntryType.Work })
export class WorkRevision extends Revision<Work, WorkSnapshot> {
	@ManyToOne()
	work: IdentifiedReference<Work>;

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

		this.work = Reference.create(work);
	}

	get entry(): Work {
		return this.work.getEntity();
	}
}
