import {
	Collection,
	Embedded,
	Entity,
	Enum,
	IdentifiedReference,
	ManyToOne,
	OneToMany,
	OneToOne,
	PrimaryKey,
	Property,
	Reference,
} from '@mikro-orm/core';

import { EntryType } from '../models/EntryType';
import { IEntryWithRevisions } from '../models/IEntryWithRevisions';
import { IEntryWithSearchIndex } from '../models/IEntryWithSearchIndex';
import { IEntryWithWebLinks } from '../models/IEntryWithWebLinks';
import { IEntryWithWorkLinks } from '../models/IEntryWithWorkLinks';
import { IRevisionFactory } from '../models/IRevisionFactory';
import { IWebLinkFactory } from '../models/IWebLinkFactory';
import { IWorkLinkFactory } from '../models/IWorkLinkFactory';
import { LinkType } from '../models/LinkType';
import { RevisionEvent } from '../models/RevisionEvent';
import { RevisionManager } from '../models/RevisionManager';
import { WebLinkCategory } from '../models/WebLinkCategory';
import { QuoteType } from '../models/quotes/QuoteType';
import { QuoteSnapshot } from '../models/snapshots/QuoteSnapshot';
import { NgramConverter } from '../services/NgramConverter';
import { Artist } from './Artist';
import { Commit } from './Commit';
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
		IEntryWithSearchIndex<QuoteSearchIndex>,
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

	@Property({ columnType: 'text' })
	text!: string;

	@Property()
	phraseCount = 0;

	@Property({ columnType: 'text' })
	transcription = '';

	@Property({ length: 85 })
	locale!: string;

	@ManyToOne()
	artist!: IdentifiedReference<Artist>;

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

	@Property({ columnType: 'text' })
	foreword = '';

	@Property()
	customArtistName = '';

	@ManyToOne()
	actor: IdentifiedReference<User>;

	@OneToOne(() => QuoteSearchIndex, (searchIndex) => searchIndex.quote)
	searchIndex: IdentifiedReference<QuoteSearchIndex>;

	constructor(actor: User) {
		this.actor = Reference.create(actor);
		this.searchIndex = Reference.create(new QuoteSearchIndex(this));
	}

	get entryType(): EntryType.Quote {
		return EntryType.Quote;
	}

	updateSearchIndex(ngramConverter: NgramConverter): void {
		const searchIndex = this.searchIndex.getEntity();
		searchIndex.text = ngramConverter.toFullText(
			[this.text, this.transcription].join(' '),
			2,
		);
	}

	takeSnapshot(): QuoteSnapshot {
		return QuoteSnapshot.create(this);
	}

	createRevision(
		commit: Commit,
		actor: User,
		event: RevisionEvent,
		summary: string,
		version: number,
	): QuoteRevision {
		return new QuoteRevision({
			quote: this,
			commit: commit,
			actor: actor,
			snapshot: this.takeSnapshot(),
			summary: summary,
			event: event,
			version: version,
		});
	}

	createWebLink(
		address: WebAddress,
		title: string,
		category: WebLinkCategory,
	): QuoteWebLink {
		return new QuoteWebLink({
			quote: this,
			address: address,
			title: title,
			category: category,
		});
	}

	createWorkLink(
		relatedWork: Work,
		linkType: LinkType,
		beginDate: PartialDate,
		endDate: PartialDate,
		ended: boolean,
	): QuoteWorkLink {
		return new QuoteWorkLink({
			quote: this,
			relatedWork: relatedWork,
			linkType: linkType,
			beginDate: beginDate,
			endDate: endDate,
			ended: ended,
		});
	}
}

@Entity({ tableName: 'quote_search_index' })
export class QuoteSearchIndex {
	@PrimaryKey()
	id!: number;

	@OneToOne()
	quote: Quote;

	@Property({ columnType: 'text', lazy: true })
	text = '';

	constructor(quote: Quote) {
		this.quote = quote;
	}

	get entry(): IEntryWithSearchIndex<QuoteSearchIndex> {
		return this.quote;
	}
}
