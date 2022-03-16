import { Entity, Enum, ManyToOne, PrimaryKey } from '@mikro-orm/core';

import { EntryType } from '../models/EntryType';
import { WebLinkCategory } from '../models/WebLinkCategory';
import { Artist } from './Artist';
import { Quote } from './Quote';
import { Translation } from './Translation';
import { Url } from './Url';
import { Work } from './Work';

@Entity({
	tableName: 'web_links',
	abstract: true,
	discriminatorColumn: 'entryType',
})
export abstract class WebLink {
	@PrimaryKey()
	id!: number;

	@ManyToOne()
	url: Url;

	@Enum()
	category: WebLinkCategory;

	protected constructor({
		url,
		category,
	}: {
		url: Url;
		category: WebLinkCategory;
	}) {
		this.url = url;
		this.category = category;
	}
}

@Entity({ tableName: 'web_links', discriminatorValue: EntryType.Translation })
export class TranslationWebLink extends WebLink {
	@ManyToOne()
	translation: Translation;

	constructor({
		translation,
		url,
		category,
	}: {
		translation: Translation;
		url: Url;
		category: WebLinkCategory;
	}) {
		super({ url, category });

		this.translation = translation;
	}
}

@Entity({ tableName: 'web_links', discriminatorValue: EntryType.Artist })
export class ArtistWebLink extends WebLink {
	@ManyToOne()
	artist: Artist;

	constructor({
		artist,
		url,
		category,
	}: {
		artist: Artist;
		url: Url;
		category: WebLinkCategory;
	}) {
		super({ url, category });

		this.artist = artist;
	}
}

@Entity({ tableName: 'web_links', discriminatorValue: EntryType.Quote })
export class QuoteWebLink extends WebLink {
	@ManyToOne()
	quote: Quote;

	constructor({
		quote,
		url,
		category,
	}: {
		quote: Quote;
		url: Url;
		category: WebLinkCategory;
	}) {
		super({ url, category });

		this.quote = quote;
	}
}

@Entity({ tableName: 'web_links', discriminatorValue: EntryType.Work })
export class WorkWebLink extends WebLink {
	@ManyToOne()
	work: Work;

	constructor({
		work,
		url,
		category,
	}: {
		work: Work;
		url: Url;
		category: WebLinkCategory;
	}) {
		super({ url, category });

		this.work = work;
	}
}
