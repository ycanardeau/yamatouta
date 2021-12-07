import { Embeddable, Property } from '@mikro-orm/core';

@Embeddable()
export class PartialDate {
	@Property()
	year?: number;

	@Property()
	month?: number;

	@Property()
	day?: number;
}
