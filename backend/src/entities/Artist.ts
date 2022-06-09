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
import { IEntryWithRevisions } from '../models/IEntryWithRevisions';
import { IEntryWithSearchIndex } from '../models/IEntryWithSearchIndex';
import { IEntryWithWebLinks } from '../models/IEntryWithWebLinks';
import { RevisionEvent } from '../models/RevisionEvent';
import { RevisionManager } from '../models/RevisionManager';
import { WebLinkCategory } from '../models/WebLinkCategory';
import { ArtistType } from '../models/artists/ArtistType';
import { ArtistSnapshot } from '../models/snapshots/ArtistSnapshot';
import { NgramConverter } from '../services/NgramConverter';
import { WorkArtistLink } from './ArtistLink';
import { Commit } from './Commit';
import { ArtistRevision } from './Revision';
import { User } from './User';
import { WebAddress } from './WebAddress';
import { ArtistWebLink } from './WebLink';

@Entity({ tableName: 'artists' })
export class Artist
	implements
		IEntryWithSearchIndex<ArtistSearchIndex>,
		IEntryWithRevisions<Artist, ArtistSnapshot, ArtistRevision>,
		IEntryWithWebLinks<ArtistWebLink>
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
		ArtistSnapshot,
		ArtistRevision
	> {
		return new RevisionManager(this);
	}

	@OneToMany(() => ArtistWebLink, (webLink) => webLink.artist)
	webLinks = new Collection<ArtistWebLink>(this);

	@OneToMany(() => WorkArtistLink, (workLink) => workLink.relatedArtist)
	workLinks = new Collection<WorkArtistLink>(this);

	@ManyToOne()
	actor: IdentifiedReference<User>;

	@OneToOne(() => ArtistSearchIndex, (searchIndex) => searchIndex.artist)
	searchIndex: IdentifiedReference<ArtistSearchIndex>;

	constructor(actor: User) {
		this.actor = Reference.create(actor);
		this.searchIndex = Reference.create(new ArtistSearchIndex(this));
	}

	get entryType(): EntryType.Artist {
		return EntryType.Artist;
	}

	updateSearchIndex(ngramConverter: NgramConverter): void {
		const searchIndex = this.searchIndex.getEntity();
		searchIndex.name = ngramConverter.toFullText(this.name, 2);
	}

	takeSnapshot(): ArtistSnapshot {
		return ArtistSnapshot.create(this);
	}

	createRevision(
		commit: Commit,
		actor: User,
		event: RevisionEvent,
		summary: string,
		version: number,
	): ArtistRevision {
		return new ArtistRevision({
			artist: this,
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
	): ArtistWebLink {
		return new ArtistWebLink({
			artist: this,
			address: address,
			title: title,
			category: category,
		});
	}
}

@Entity({ tableName: 'artist_search_index' })
export class ArtistSearchIndex {
	@PrimaryKey()
	id!: number;

	@OneToOne()
	artist: Artist;

	@Property({ columnType: 'text', lazy: true })
	name = '';

	constructor(artist: Artist) {
		this.artist = artist;
	}

	get entry(): IEntryWithSearchIndex<ArtistSearchIndex> {
		return this.artist;
	}
}
