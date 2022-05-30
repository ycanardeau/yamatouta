import {
	Collection,
	Entity,
	Enum,
	OneToMany,
	PrimaryKey,
	Property,
} from '@mikro-orm/core';

import { IEntryWithRevisions } from '../models/IEntryWithRevisions';
import { IEntryWithWebLinks } from '../models/IEntryWithWebLinks';
import { IRevisionFactory } from '../models/IRevisionFactory';
import { IWebLinkFactory } from '../models/IWebLinkFactory';
import { RevisionEvent } from '../models/RevisionEvent';
import { RevisionManager } from '../models/RevisionManager';
import { WebLinkCategory } from '../models/WebLinkCategory';
import { ArtistType } from '../models/artists/ArtistType';
import { ArtistSnapshot } from '../models/snapshots/ArtistSnapshot';
import { WorkArtistLink } from './ArtistLink';
import { Commit } from './Commit';
import { ArtistRevision } from './Revision';
import { User } from './User';
import { WebAddress } from './WebAddress';
import { ArtistWebLink } from './WebLink';

@Entity({ tableName: 'artists' })
export class Artist
	implements
		IEntryWithRevisions<Artist, ArtistRevision, ArtistSnapshot>,
		IRevisionFactory<Artist, ArtistRevision, ArtistSnapshot>,
		IEntryWithWebLinks<ArtistWebLink>,
		IWebLinkFactory<ArtistWebLink>
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

	@Enum(() => ArtistType)
	artistType!: ArtistType;

	@Property()
	version = 0;

	@OneToMany(() => ArtistRevision, (revision) => revision.artist)
	revisions = new Collection<ArtistRevision>(this);

	get revisionManager(): RevisionManager<
		Artist,
		ArtistRevision,
		ArtistSnapshot
	> {
		return new RevisionManager(this);
	}

	@OneToMany(() => ArtistWebLink, (webLink) => webLink.artist)
	webLinks = new Collection<ArtistWebLink>(this);

	@OneToMany(() => WorkArtistLink, (workLink) => workLink.relatedArtist)
	workLinks = new Collection<WorkArtistLink>(this);

	takeSnapshot(): ArtistSnapshot {
		return ArtistSnapshot.create(this);
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
	}): ArtistRevision {
		return new ArtistRevision({
			artist: this,
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
	}): ArtistWebLink {
		return new ArtistWebLink({
			artist: this,
			address: address,
			title: title,
			category: category,
		});
	}
}
