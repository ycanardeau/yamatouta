import { Embedded, Entity, Enum, PrimaryKey, Property } from '@mikro-orm/core';

import { AuthorType } from '../models/AuthorType';
import { IAuthor } from '../models/IAuthor';
import { QuoteType } from '../models/QuoteType';
import { PartialDate } from './PartialDate';

@Entity({
	tableName: 'quotes',
	abstract: true,
	discriminatorColumn: 'authorType',
})
export abstract class Quote {
	@PrimaryKey()
	id!: number;

	@Property()
	createdAt = new Date();

	@Property({ onUpdate: () => new Date() })
	updatedAt = new Date();

	@Property()
	deleted = false;

	@Property()
	hidden = false;

	@Enum(() => QuoteType)
	quoteType: QuoteType;

	@Property({ length: 2048 })
	text: string;

	@Property()
	phraseCount = 0;

	@Property()
	transcription!: string;

	@Property({ length: 85 })
	locale: string;

	@Enum()
	authorType!: AuthorType;

	@Property()
	sourceUrl!: string;

	@Embedded({ prefix: false })
	date = new PartialDate();

	protected constructor({
		quoteType,
		text,
		locale,
	}: {
		quoteType: QuoteType;
		text: string;
		locale: string;
	}) {
		this.quoteType = quoteType;
		this.text = text;
		this.locale = locale;
	}

	abstract get author(): IAuthor;
}
