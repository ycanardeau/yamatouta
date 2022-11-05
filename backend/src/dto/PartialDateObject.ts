import { PartialDate } from '@/entities/PartialDate';

export class PartialDateObject {
	private constructor(
		readonly year?: number,
		readonly month?: number,
		readonly day?: number,
	) {}

	static create(partialDate: PartialDate): PartialDateObject {
		return new PartialDateObject(
			partialDate.year,
			partialDate.month,
			partialDate.day,
		);
	}
}
