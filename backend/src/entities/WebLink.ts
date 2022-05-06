import { Entity, Enum, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';

import { EntryType } from '../models/EntryType';
import { IContentEquatable } from '../models/IContentEquatable';
import { WebLinkCategory } from '../models/WebLinkCategory';
import { Artist } from './Artist';
import { Quote } from './Quote';
import { Translation } from './Translation';
import { WebAddress } from './WebAddress';
import { Work } from './Work';

@Entity({
	tableName: 'web_links',
	abstract: true,
	discriminatorColumn: 'entryType',
})
export abstract class WebLink
	implements
		IContentEquatable<{
			url: string;
			title: string;
			category: WebLinkCategory;
		}>
{
	@PrimaryKey()
	id!: number;

	@ManyToOne()
	address: WebAddress;

	@Property()
	title: string;

	@Enum()
	category: WebLinkCategory;

	protected constructor({
		address,
		title,
		category,
	}: {
		address: WebAddress;
		title: string;
		category: WebLinkCategory;
	}) {
		this.address = address;
		this.title = title;
		this.category = category;
	}

	get url(): string {
		return this.address.url;
	}

	contentEquals(other: {
		url: string;
		title: string;
		category: WebLinkCategory;
	}): boolean {
		return (
			this.url === other.url &&
			this.title === other.title &&
			this.category === other.category
		);
	}

	setAddress(value: WebAddress): void {
		this.address.decrementReferenceCount();

		this.address = value;

		this.address.incrementReferenceCount();
	}
}

@Entity({ tableName: 'web_links', discriminatorValue: EntryType.Translation })
export class TranslationWebLink extends WebLink {
	@ManyToOne()
	translation: Translation;

	constructor({
		translation,
		address,
		title,
		category,
	}: {
		translation: Translation;
		address: WebAddress;
		title: string;
		category: WebLinkCategory;
	}) {
		super({ address, title, category });

		this.translation = translation;
	}
}

@Entity({ tableName: 'web_links', discriminatorValue: EntryType.Artist })
export class ArtistWebLink extends WebLink {
	@ManyToOne()
	artist: Artist;

	constructor({
		artist,
		address,
		title,
		category,
	}: {
		artist: Artist;
		address: WebAddress;
		title: string;
		category: WebLinkCategory;
	}) {
		super({ address, title, category });

		this.artist = artist;
	}
}

@Entity({ tableName: 'web_links', discriminatorValue: EntryType.Quote })
export class QuoteWebLink extends WebLink {
	@ManyToOne()
	quote: Quote;

	constructor({
		quote,
		address,
		title,
		category,
	}: {
		quote: Quote;
		address: WebAddress;
		title: string;
		category: WebLinkCategory;
	}) {
		super({ address, title, category });

		this.quote = quote;
	}
}

@Entity({ tableName: 'web_links', discriminatorValue: EntryType.Work })
export class WorkWebLink extends WebLink {
	@ManyToOne()
	work: Work;

	constructor({
		work,
		address,
		title,
		category,
	}: {
		work: Work;
		address: WebAddress;
		title: string;
		category: WebLinkCategory;
	}) {
		super({ address, title, category });

		this.work = work;
	}
}
