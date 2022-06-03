import {
	Entity,
	IdentifiedReference,
	ManyToOne,
	PrimaryKey,
	Property,
	Reference,
} from '@mikro-orm/core';

import { EntryType } from '../models/EntryType';
import { IArtistLink } from '../models/IArtistLink';
import { IContentEquatable } from '../models/IContentEquatable';
import { Artist } from './Artist';
import { Link } from './Link';
import { Work } from './Work';

@Entity({
	tableName: 'artist_links',
	abstract: true,
	discriminatorColumn: 'entryType',
})
export abstract class ArtistLink
	extends Link
	implements IArtistLink, IContentEquatable<IArtistLink>
{
	@Property()
	createdAt = new Date();

	@PrimaryKey()
	id!: number;

	@ManyToOne()
	relatedArtist: IdentifiedReference<Artist>;

	protected constructor({
		relatedArtist,
		...params
	}: { relatedArtist: Artist } & Link) {
		super(params);

		this.relatedArtist = Reference.create(relatedArtist);
	}

	get relatedArtistId(): number {
		return this.relatedArtist.id;
	}

	contentEquals(other: IArtistLink): boolean {
		return (
			this.relatedArtistId === other.relatedArtistId &&
			this.linkType === other.linkType
		);
	}
}

@Entity({ tableName: 'artist_links', discriminatorValue: EntryType.Artist })
export class ArtistArtistLink extends ArtistLink {
	@ManyToOne()
	artist: IdentifiedReference<Artist>;

	constructor({
		artist,
		relatedArtist,
		...params
	}: {
		artist: Artist;
		relatedArtist: Artist;
	} & Link) {
		super({ ...params, relatedArtist });

		this.artist = Reference.create(artist);
	}
}

@Entity({ tableName: 'artist_links', discriminatorValue: EntryType.Work })
export class WorkArtistLink extends ArtistLink {
	@ManyToOne()
	work: IdentifiedReference<Work>;

	constructor({
		work,
		relatedArtist,
		...params
	}: {
		work: Work;
		relatedArtist: Artist;
	} & Link) {
		super({ ...params, relatedArtist });

		this.work = Reference.create(work);
	}
}
