import {
	Collection,
	Embedded,
	Entity,
	Enum,
	OneToMany,
	PrimaryKey,
	Property,
} from '@mikro-orm/core';

import { AuthorType } from '../models/AuthorType';
import { IAuthor } from '../models/IAuthor';
import { IEntryWithRevisions } from '../models/IEntryWithRevisions';
import { IRevisionFactory } from '../models/IRevisionFactory';
import { QuoteType } from '../models/QuoteType';
import { RevisionEvent } from '../models/RevisionEvent';
import { RevisionManager } from '../models/RevisionManager';
import { QuoteSnapshot } from '../models/Snapshot';
import { Commit } from './Commit';
import { PartialDate } from './PartialDate';
import { QuoteRevision } from './Revision';
import { User } from './User';

@Entity({
	tableName: 'quotes',
	abstract: true,
	discriminatorColumn: 'authorType',
})
export abstract class Quote
	implements
		IEntryWithRevisions<Quote, QuoteRevision, QuoteSnapshot>,
		IRevisionFactory<Quote, QuoteRevision, QuoteSnapshot>
{
	@PrimaryKey()
	id!: number;

	@Property()
	createdAt = new Date();

	@Property({ onUpdate: () => new Date() })
	updatedAt = new Date();

	@Property()
	deleted = false;

	@Property()
	hidden = false;

	@Enum(() => QuoteType)
	quoteType: QuoteType;

	@Property({ length: 2048 })
	text: string;

	@Property()
	phraseCount = 0;

	@Property()
	transcription!: string;

	@Property({ length: 85 })
	locale: string;

	@Enum()
	authorType!: AuthorType;

	@Property()
	sourceUrl!: string;

	@Embedded({ prefix: false })
	date = new PartialDate();

	@Property()
	version = 0;

	@OneToMany(() => QuoteRevision, (revision) => revision.quote)
	revisions = new Collection<QuoteRevision>(this);

	get revisionManager(): RevisionManager<
		Quote,
		QuoteRevision,
		QuoteSnapshot
	> {
		return new RevisionManager(this);
	}

	protected constructor({
		quoteType,
		text,
		locale,
	}: {
		quoteType: QuoteType;
		text: string;
		locale: string;
	}) {
		this.quoteType = quoteType;
		this.text = text;
		this.locale = locale;
	}

	abstract get author(): IAuthor;

	createRevision({
		commit,
		actor,
		event,
		summary,
	}: {
		commit: Commit;
		actor: User;
		event: RevisionEvent;
		summary: string;
	}): QuoteRevision {
		return new QuoteRevision({
			quote: this,
			commit: commit,
			actor: actor,
			snapshot: new QuoteSnapshot({ quote: this }),
			summary: summary,
			event: event,
			version: ++this.version,
		});
	}
}
