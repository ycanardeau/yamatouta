import {
	Entity,
	Enum,
	IdentifiedReference,
	ManyToOne,
	PrimaryKey,
	Property,
	Reference,
} from '@mikro-orm/core';

import { EntryType } from '../models/EntryType';
import { IContentEquatable } from '../models/IContentEquatable';
import { IWebLink } from '../models/IWebLink';
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
export abstract class WebLink implements IWebLink, IContentEquatable<IWebLink> {
	@PrimaryKey()
	id!: number;

	@ManyToOne()
	address: IdentifiedReference<WebAddress>;

	@Property()
	title: string;

	@Enum()
	category: WebLinkCategory;

	protected constructor(
		address: WebAddress,
		title: string,
		category: WebLinkCategory,
	) {
		this.address = Reference.create(address);
		this.title = title;
		this.category = category;
	}

	get url(): string {
		return this.address.getEntity().url;
	}

	contentEquals(other: IWebLink): boolean {
		return (
			this.url === other.url &&
			this.title === other.title &&
			this.category === other.category
		);
	}

	setAddress(value: WebAddress): void {
		this.address.getEntity().decrementReferenceCount();

		this.address = Reference.create(value);

		this.address.getEntity().incrementReferenceCount();
	}
}

@Entity({ tableName: 'web_links', discriminatorValue: EntryType.Translation })
export class TranslationWebLink extends WebLink {
	@ManyToOne()
	translation: IdentifiedReference<Translation>;

	constructor(
		translation: Translation,
		address: WebAddress,
		title: string,
		category: WebLinkCategory,
	) {
		super(address, title, category);

		this.translation = Reference.create(translation);
	}
}

@Entity({ tableName: 'web_links', discriminatorValue: EntryType.Artist })
export class ArtistWebLink extends WebLink {
	@ManyToOne()
	artist: IdentifiedReference<Artist>;

	constructor(
		artist: Artist,
		address: WebAddress,
		title: string,
		category: WebLinkCategory,
	) {
		super(address, title, category);

		this.artist = Reference.create(artist);
	}
}

@Entity({ tableName: 'web_links', discriminatorValue: EntryType.Quote })
export class QuoteWebLink extends WebLink {
	@ManyToOne()
	quote: IdentifiedReference<Quote>;

	constructor(
		quote: Quote,
		address: WebAddress,
		title: string,
		category: WebLinkCategory,
	) {
		super(address, title, category);

		this.quote = Reference.create(quote);
	}
}

@Entity({ tableName: 'web_links', discriminatorValue: EntryType.Work })
export class WorkWebLink extends WebLink {
	@ManyToOne()
	work: IdentifiedReference<Work>;

	constructor(
		work: Work,
		address: WebAddress,
		title: string,
		category: WebLinkCategory,
	) {
		super(address, title, category);

		this.work = Reference.create(work);
	}
}
