import {
	Collection,
	Embedded,
	Entity,
	Enum,
	ManyToOne,
	OneToMany,
	PrimaryKey,
	Property,
} from '@mikro-orm/core';

import { EntryType } from '../models/EntryType';
import { IEntryWithRevisions } from '../models/IEntryWithRevisions';
import { IEntryWithWebLinks } from '../models/IEntryWithWebLinks';
import { IEntryWithWorkLinks } from '../models/IEntryWithWorkLinks';
import { IRevisionFactory } from '../models/IRevisionFactory';
import { IWebLinkFactory } from '../models/IWebLinkFactory';
import { IWorkLinkFactory } from '../models/IWorkLinkFactory';
import { RevisionEvent } from '../models/RevisionEvent';
import { RevisionManager } from '../models/RevisionManager';
import { WebLinkCategory } from '../models/WebLinkCategory';
import { QuoteType } from '../models/quotes/QuoteType';
import { QuoteSnapshot } from '../models/snapshots/QuoteSnapshot';
import { Artist } from './Artist';
import { Commit } from './Commit';
import { Link } from './Link';
import { PartialDate } from './PartialDate';
import { QuoteRevision } from './Revision';
import { User } from './User';
import { WebAddress } from './WebAddress';
import { QuoteWebLink } from './WebLink';
import { Work } from './Work';
import { QuoteWorkLink } from './WorkLink';

@Entity({
	tableName: 'quotes',
})
export class Quote
	implements
		IEntryWithRevisions<Quote, QuoteRevision, QuoteSnapshot>,
		IRevisionFactory<Quote, QuoteRevision, QuoteSnapshot>,
		IEntryWithWebLinks<QuoteWebLink>,
		IWebLinkFactory<QuoteWebLink>,
		IEntryWithWorkLinks<QuoteWorkLink>,
		IWorkLinkFactory<QuoteWorkLink>
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
	quoteType!: QuoteType;

	@Property({ length: 2048 })
	text!: string;

	@Property()
	phraseCount = 0;

	@Property()
	transcription = '';

	@Property({ length: 85 })
	locale!: string;

	@ManyToOne()
	artist!: Artist;

	@Property()
	sourceUrl = '';

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

	@OneToMany(() => QuoteWebLink, (webLink) => webLink.quote)
	webLinks = new Collection<QuoteWebLink>(this);

	@OneToMany(() => QuoteWorkLink, (workLink) => workLink.quote)
	workLinks = new Collection<QuoteWorkLink>(this);

	get entryType(): EntryType {
		return EntryType.Quote;
	}

	takeSnapshot(): QuoteSnapshot {
		return QuoteSnapshot.create(this);
	}

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
			snapshot: this.takeSnapshot(),
			summary: summary,
			event: event,
			version: ++this.version,
		});
	}

	createWebLink({
		address,
		title,
		category,
	}: {
		address: WebAddress;
		title: string;
		category: WebLinkCategory;
	}): QuoteWebLink {
		return new QuoteWebLink({
			quote: this,
			address: address,
			title: title,
			category: category,
		});
	}

	createWorkLink({
		relatedWork,
		...params
	}: { relatedWork: Work } & Link): QuoteWorkLink {
		return new QuoteWorkLink({
			...params,
			quote: this,
			relatedWork: relatedWork,
		});
	}
}
