import {
	Collection,
	Entity,
	Enum,
	OneToMany,
	PrimaryKey,
	Property,
} from '@mikro-orm/core';

import { EntryType } from '../models/EntryType';
import { IArtistLinkFactory } from '../models/IArtistLinkFactory';
import { IEntryWithArtistLinks } from '../models/IEntryWithArtistLinks';
import { IEntryWithRevisions } from '../models/IEntryWithRevisions';
import { IEntryWithWebLinks } from '../models/IEntryWithWebLinks';
import { IRevisionFactory } from '../models/IRevisionFactory';
import { IWebLinkFactory } from '../models/IWebLinkFactory';
import { LinkType } from '../models/LinkType';
import { RevisionEvent } from '../models/RevisionEvent';
import { WebLinkCategory } from '../models/WebLinkCategory';
import { WorkSnapshot } from '../models/snapshots/WorkSnapshot';
import { WorkType } from '../models/works/WorkType';
import { Artist } from './Artist';
import { WorkArtistLink } from './ArtistLink';
import { Commit } from './Commit';
import { PartialDate } from './PartialDate';
import { WorkRevision } from './Revision';
import { User } from './User';
import { WebAddress } from './WebAddress';
import { WorkWebLink } from './WebLink';
import { QuoteWorkLink, TranslationWorkLink } from './WorkLink';

@Entity({ tableName: 'works' })
export class Work
	implements
		IEntryWithRevisions<Work, WorkRevision, WorkSnapshot>,
		IRevisionFactory<Work, WorkRevision, WorkSnapshot>,
		IEntryWithWebLinks<WorkWebLink>,
		IWebLinkFactory<WorkWebLink>,
		IEntryWithArtistLinks<WorkArtistLink>,
		IArtistLinkFactory<WorkArtistLink>
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

	get entryType(): EntryType.Work {
		return EntryType.Work;
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
		return new WorkRevision({
			work: this,
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
	): WorkWebLink {
		return new WorkWebLink({
			work: this,
			address: address,
			title: title,
			category: category,
		});
	}

	createArtistLink(
		relatedArtist: Artist,
		linkType: LinkType,
		beginDate: PartialDate,
		endDate: PartialDate,
		ended: boolean,
	): WorkArtistLink {
		return new WorkArtistLink({
			work: this,
			relatedArtist: relatedArtist,
			linkType: linkType,
			beginDate: beginDate,
			endDate: endDate,
			ended: ended,
		});
	}
}
