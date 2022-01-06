import { Embeddable, Property } from '@mikro-orm/core';

@Embeddable()
export class inishienomanabi_TranslatedString {
	@Property()
	japanese!: string;

	@Property()
	reading!: string;

	@Property()
	yamatokotoba!: string;
}
