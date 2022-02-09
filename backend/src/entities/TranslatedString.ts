import { Embeddable, Property } from '@mikro-orm/core';

@Embeddable()
export class TranslatedString {
	@Property()
	headword!: string;

	@Property({ length: 85 })
	locale!: string;

	@Property()
	reading!: string;

	@Property()
	yamatokotoba!: string;
}
