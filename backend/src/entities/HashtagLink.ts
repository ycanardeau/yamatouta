import {
	Entity,
	IdentifiedReference,
	ManyToOne,
	PrimaryKey,
	Property,
	Reference,
} from '@mikro-orm/core';

import { EntryType } from '../models/EntryType';
import { IContentEquatable } from '../models/IContentEquatable';
import { IHashtagLink } from '../models/IHashtagLink';
import { Artist } from './Artist';
import { Hashtag } from './Hashtag';
import { Quote } from './Quote';
import { Translation } from './Translation';
import { Work } from './Work';

@Entity({
	tableName: 'hashtag_links',
	abstract: true,
	discriminatorColumn: 'entryType',
})
export abstract class HashtagLink
	implements IHashtagLink, IContentEquatable<IHashtagLink>
{
	@PrimaryKey()
	id!: number;

	@Property()
	createdAt = new Date();

	@ManyToOne()
	relatedHashtag: IdentifiedReference<Hashtag>;

	@Property({ length: 100 })
	label: string;

	protected constructor(relatedHashtag: Hashtag, label: string) {
		this.relatedHashtag = Reference.create(relatedHashtag);
		this.label = label;
	}

	get name(): string {
		return this.relatedHashtag.getProperty('name');
	}

	contentEquals(other: IHashtagLink): boolean {
		return this.name === other.name;
	}

	setRelatedHashtag(value: Hashtag): void {
		this.relatedHashtag.getEntity().decrementReferenceCount();

		this.relatedHashtag = Reference.create(value);

		this.relatedHashtag.getEntity().incrementReferenceCount();
	}
}

@Entity({ tableName: 'hashtag_links', discriminatorValue: EntryType.Artist })
export class ArtistHashtagLink extends HashtagLink {
	@ManyToOne()
	artist: Artist;

	constructor(artist: Artist, relatedHashtag: Hashtag, label: string) {
		super(relatedHashtag, label);

		this.artist = artist;
	}
}

@Entity({ tableName: 'hashtag_links', discriminatorValue: EntryType.Quote })
export class QuoteHashtagLink extends HashtagLink {
	@ManyToOne()
	quote: Quote;

	constructor(quote: Quote, relatedHashtag: Hashtag, label: string) {
		super(relatedHashtag, label);

		this.quote = quote;
	}
}

@Entity({
	tableName: 'hashtag_links',
	discriminatorValue: EntryType.Translation,
})
export class TranslationHashtagLink extends HashtagLink {
	@ManyToOne()
	translation: Translation;

	constructor(
		translation: Translation,
		relatedHashtag: Hashtag,
		label: string,
	) {
		super(relatedHashtag, label);

		this.translation = translation;
	}
}

@Entity({ tableName: 'hashtag_links', discriminatorValue: EntryType.Work })
export class WorkHashtagLink extends HashtagLink {
	@ManyToOne()
	work: Work;

	constructor(work: Work, relatedHashtag: Hashtag, label: string) {
		super(relatedHashtag, label);

		this.work = work;
	}
}
