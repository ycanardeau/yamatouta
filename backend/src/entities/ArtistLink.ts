import { Entity, ManyToOne, PrimaryKey } from '@mikro-orm/core';

import { EntryType } from '../models/EntryType';
import { Artist } from './Artist';
import { Link } from './Link';
import { Work } from './Work';

@Entity({
	tableName: 'artist_links',
	abstract: true,
	discriminatorColumn: 'entryType',
})
export abstract class ArtistLink extends Link {
	@PrimaryKey()
	id!: number;

	@ManyToOne()
	relatedArtist: Artist;

	protected constructor({
		relatedArtist,
		...params
	}: Link & { relatedArtist: Artist }) {
		super(params);

		this.relatedArtist = relatedArtist;
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
	}: Link & {
		artist: Artist;
		relatedArtist: Artist;
	}) {
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
	}: Link & {
		work: Work;
		relatedArtist: Artist;
	}) {
		super({ ...params, relatedArtist });

		this.work = work;
	}
}
