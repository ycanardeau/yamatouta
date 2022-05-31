import { Embeddable, Property } from '@mikro-orm/core';

import { IContentEquatable } from '../models/IContentEquatable';
import { IPartialDate } from '../models/IPartialDate';

@Embeddable()
export class PartialDate
	implements IPartialDate, IContentEquatable<IPartialDate>
{
	@Property()
	year?: number;

	@Property()
	month?: number;

	@Property()
	day?: number;

	constructor(year?: number, month?: number, day?: number) {
		this.year = year;
		this.month = month;
		this.day = day;
	}

	static create(partialDate: IPartialDate): PartialDate {
		return new PartialDate(
			partialDate.year,
			partialDate.month,
			partialDate.day,
		);
	}

	contentEquals(other: IPartialDate): boolean {
		return (
			this.year === other.year &&
			this.month === other.month &&
			this.day === other.day
		);
	}
}
