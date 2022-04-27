import { Entity, Enum, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';

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

	@Property()
	title: string;

	@Enum()
	category: WebLinkCategory;

	protected constructor({
		url,
		title,
		category,
	}: {
		url: Url;
		title: string;
		category: WebLinkCategory;
	}) {
		this.url = url;
		this.title = title;
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
		title,
		category,
	}: {
		translation: Translation;
		url: Url;
		title: string;
		category: WebLinkCategory;
	}) {
		super({ url, title, category });

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
		title,
		category,
	}: {
		artist: Artist;
		url: Url;
		title: string;
		category: WebLinkCategory;
	}) {
		super({ url, title, category });

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
		title,
		category,
	}: {
		quote: Quote;
		url: Url;
		title: string;
		category: WebLinkCategory;
	}) {
		super({ url, title, category });

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
		title,
		category,
	}: {
		work: Work;
		url: Url;
		title: string;
		category: WebLinkCategory;
	}) {
		super({ url, title, category });

		this.work = work;
	}
}
