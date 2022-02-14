import { Entity, ManyToOne } from '@mikro-orm/core';

import { AuthorType } from '../models/AuthorType';
import { IAuthor } from '../models/IAuthor';
import { QuoteType } from '../models/QuoteType';
import { Artist } from './Artist';
import { Quote } from './Quote';

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
