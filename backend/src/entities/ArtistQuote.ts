import { Entity, ManyToOne } from '@mikro-orm/core';

import { Artist } from './Artist';
import { AuthorType, IAuthor, Quote, QuoteType } from './Quote';

@Entity({ tableName: 'quotes', discriminatorValue: AuthorType.Artist })
export class ArtistQuote extends Quote {
	@ManyToOne()
	artist: Artist;

	constructor({
		quoteType,
		text,
		locale,
		artist,
	}: {
		quoteType: QuoteType;
		text: string;
		locale?: string;
		artist: Artist;
	}) {
		super({ quoteType, text, locale });

		this.artist = artist;
	}

	get author(): IAuthor {
		return this.artist;
	}
}
