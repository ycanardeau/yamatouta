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
import { LinkType } from '../models/LinkType';
import { Artist } from './Artist';
import { Link } from './Link';
import { PartialDate } from './PartialDate';
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
	@PrimaryKey()
	id!: number;

	@Property()
	createdAt = new Date();

	@ManyToOne()
	relatedArtist: IdentifiedReference<Artist>;

	protected constructor(
		relatedArtist: Artist,
		linkType: LinkType,
		beginDate: PartialDate,
		endDate: PartialDate,
		ended: boolean,
	) {
		super(linkType, beginDate, endDate, ended);

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

	constructor(
		artist: Artist,
		relatedArtist: Artist,
		linkType: LinkType,
		beginDate: PartialDate,
		endDate: PartialDate,
		ended: boolean,
	) {
		super(relatedArtist, linkType, beginDate, endDate, ended);

		this.artist = Reference.create(artist);
	}
}

@Entity({ tableName: 'artist_links', discriminatorValue: EntryType.Work })
export class WorkArtistLink extends ArtistLink {
	@ManyToOne()
	work: IdentifiedReference<Work>;

	constructor(
		work: Work,
		relatedArtist: Artist,
		linkType: LinkType,
		beginDate: PartialDate,
		endDate: PartialDate,
		ended: boolean,
	) {
		super(relatedArtist, linkType, beginDate, endDate, ended);

		this.work = Reference.create(work);
	}
}
