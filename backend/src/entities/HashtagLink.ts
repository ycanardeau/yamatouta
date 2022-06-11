import {
	Entity,
	IdentifiedReference,
	ManyToOne,
	PrimaryKey,
	Property,
	Reference,
} from '@mikro-orm/core';

import { EntryType } from '../models/EntryType';
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
export abstract class HashtagLink {
	@PrimaryKey()
	id!: number;

	@Property()
	createdAt = new Date();

	@ManyToOne()
	relatedHashtag: IdentifiedReference<Hashtag>;

	protected constructor(relatedHashtag: Hashtag) {
		this.relatedHashtag = Reference.create(relatedHashtag);
	}
}

@Entity({ tableName: 'hashtag_links', discriminatorValue: EntryType.Artist })
export class ArtistHashtagLink extends HashtagLink {
	@ManyToOne()
	artist: Artist;

	constructor(artist: Artist, relatedHashtag: Hashtag) {
		super(relatedHashtag);

		this.artist = artist;
	}
}

@Entity({ tableName: 'hashtag_links', discriminatorValue: EntryType.Quote })
export class QuoteHashtagLink extends HashtagLink {
	@ManyToOne()
	quote: Quote;

	constructor(quote: Quote, relatedHashtag: Hashtag) {
		super(relatedHashtag);

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

	constructor(translation: Translation, relatedHashtag: Hashtag) {
		super(relatedHashtag);

		this.translation = translation;
	}
}

@Entity({ tableName: 'hashtag_links', discriminatorValue: EntryType.Work })
export class WorkHashtagLink extends HashtagLink {
	@ManyToOne()
	work: Work;

	constructor(work: Work, relatedHashtag: Hashtag) {
		super(relatedHashtag);

		this.work = work;
	}
}
