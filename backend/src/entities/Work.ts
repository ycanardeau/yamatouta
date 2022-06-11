import {
	Collection,
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
import { IEntryWithArtistLinks } from '../models/IEntryWithArtistLinks';
import { IEntryWithHashtagLinks } from '../models/IEntryWithHashtagLinks';
import { IEntryWithRevisions } from '../models/IEntryWithRevisions';
import { IEntryWithSearchIndex } from '../models/IEntryWithSearchIndex';
import { IEntryWithWebLinks } from '../models/IEntryWithWebLinks';
import { LinkType } from '../models/LinkType';
import { RevisionEvent } from '../models/RevisionEvent';
import { WebLinkCategory } from '../models/WebLinkCategory';
import { WorkSnapshot } from '../models/snapshots/WorkSnapshot';
import { WorkType } from '../models/works/WorkType';
import { NgramConverter } from '../services/NgramConverter';
import { Artist } from './Artist';
import { WorkArtistLink } from './ArtistLink';
import { Commit } from './Commit';
import { WorkHashtagLink } from './HashtagLink';
import { PartialDate } from './PartialDate';
import { WorkRevision } from './Revision';
import { User } from './User';
import { WebAddress } from './WebAddress';
import { WorkWebLink } from './WebLink';
import { QuoteWorkLink, TranslationWorkLink } from './WorkLink';

@Entity({ tableName: 'works' })
export class Work
	implements
		IEntryWithSearchIndex<WorkSearchIndex>,
		IEntryWithRevisions<Work, WorkSnapshot, WorkRevision>,
		IEntryWithWebLinks<WorkWebLink>,
		IEntryWithArtistLinks<EntryType.Work, WorkArtistLink>,
		IEntryWithHashtagLinks<WorkHashtagLink>
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

	@Property()
	name!: string;

	@Property()
	sortName = '';

	@Enum()
	workType!: WorkType;

	@Property()
	version = 0;

	@OneToMany(() => WorkRevision, (revision) => revision.work)
	revisions = new Collection<WorkRevision>(this);

	@OneToMany(() => WorkWebLink, (webLink) => webLink.work)
	webLinks = new Collection<WorkWebLink>(this);

	@OneToMany(() => WorkArtistLink, (artistLink) => artistLink.work)
	artistLinks = new Collection<WorkArtistLink>(this);

	@OneToMany(() => QuoteWorkLink, (quoteLink) => quoteLink.relatedWork)
	quoteLinks = new Collection<QuoteWorkLink>(this);

	@OneToMany(
		() => TranslationWorkLink,
		(translationLink) => translationLink.relatedWork,
	)
	translationLinks = new Collection<TranslationWorkLink>(this);

	@ManyToOne()
	actor: IdentifiedReference<User>;

	@OneToOne(() => WorkSearchIndex, (searchIndex) => searchIndex.work)
	searchIndex: IdentifiedReference<WorkSearchIndex>;

	@OneToMany(() => WorkHashtagLink, (hashtagLink) => hashtagLink.work)
	hashtagLinks = new Collection<WorkHashtagLink>(this);

	constructor(actor: User) {
		this.actor = Reference.create(actor);
		this.searchIndex = Reference.create(new WorkSearchIndex(this));
	}

	get entryType(): EntryType.Work {
		return EntryType.Work;
	}

	updateSearchIndex(ngramConverter: NgramConverter): void {
		const searchIndex = this.searchIndex.getEntity();
		searchIndex.name = ngramConverter.toFullText(this.name, 2);
	}

	takeSnapshot(): WorkSnapshot {
		return WorkSnapshot.create(this);
	}

	createRevision(
		commit: Commit,
		actor: User,
		event: RevisionEvent,
		summary: string,
		version: number,
	): WorkRevision {
		return new WorkRevision(
			this,
			commit,
			actor,
			this.takeSnapshot(),
			summary,
			event,
			version,
		);
	}

	createWebLink(
		address: WebAddress,
		title: string,
		category: WebLinkCategory,
	): WorkWebLink {
		return new WorkWebLink(this, address, title, category);
	}

	createArtistLink(
		relatedArtist: Artist,
		linkType: LinkType,
		beginDate: PartialDate,
		endDate: PartialDate,
		ended: boolean,
	): WorkArtistLink {
		return new WorkArtistLink(
			this,
			relatedArtist,
			linkType,
			beginDate,
			endDate,
			ended,
		);
	}
}

@Entity({ tableName: 'work_search_index' })
export class WorkSearchIndex {
	@PrimaryKey()
	id!: number;

	@OneToOne()
	work: Work;

	@Property({ columnType: 'text', lazy: true })
	name = '';

	constructor(work: Work) {
		this.work = work;
	}

	get entry(): IEntryWithSearchIndex<WorkSearchIndex> {
		return this.work;
	}
}
