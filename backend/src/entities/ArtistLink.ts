import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';

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
	relatedArtist: Artist;

	protected constructor({
		relatedArtist,
		...params
	}: { relatedArtist: Artist } & Link) {
		super(params);

		this.relatedArtist = relatedArtist;
	}

	get relatedArtistId(): number {
		return this.relatedArtist.id;
	}
	set relatedArtistId(value: number) {
		this.relatedArtist.id = value;
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
	artist: Artist;

	constructor({
		artist,
		relatedArtist,
		...params
	}: {
		artist: Artist;
		relatedArtist: Artist;
	} & Link) {
		super({ ...params, relatedArtist });

		this.artist = artist;
	}
}

@Entity({ tableName: 'artist_links', discriminatorValue: EntryType.Work })
export class WorkArtistLink extends ArtistLink {
	@ManyToOne()
	work: Work;

	constructor({
		work,
		relatedArtist,
		...params
	}: {
		work: Work;
		relatedArtist: Artist;
	} & Link) {
		super({ ...params, relatedArtist });

		this.work = work;
	}
}
