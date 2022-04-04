import {
	Collection,
	Entity,
	Enum,
	OneToMany,
	PrimaryKey,
	Property,
} from '@mikro-orm/core';

import { ArtistType } from '../models/ArtistType';
import { AuthorType } from '../models/AuthorType';
import { IAuthor } from '../models/IAuthor';
import { IEntryWithRevisions } from '../models/IEntryWithRevisions';
import { IRevisionFactory } from '../models/IRevisionFactory';
import { RevisionEvent } from '../models/RevisionEvent';
import { RevisionManager } from '../models/RevisionManager';
import { ArtistSnapshot } from '../models/Snapshot';
import { Commit } from './Commit';
import { ArtistRevision } from './Revision';
import { User } from './User';

@Entity({ tableName: 'artists' })
export class Artist
	implements
		IAuthor,
		IEntryWithRevisions<Artist, ArtistRevision, ArtistSnapshot>,
		IRevisionFactory<Artist, ArtistRevision, ArtistSnapshot>
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
	name: string;

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

	constructor({
		name,
		artistType,
	}: {
		name: string;
		artistType: ArtistType;
	}) {
		this.name = name;
		this.artistType = artistType;
	}

	get authorType(): AuthorType {
		return AuthorType.Artist;
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
			snapshot: new ArtistSnapshot({ artist: this }),
			summary: summary,
			event: event,
			version: ++this.version,
		});
	}
}
