import { PartialDate } from '@/entities/PartialDate';

export class PartialDateSnapshot {
	private constructor(
		readonly year?: number,
		readonly month?: number,
		readonly day?: number,
	) {}

	static create(partialDate: PartialDate): PartialDateSnapshot {
		return new PartialDateSnapshot(
			partialDate.year,
			partialDate.month,
			partialDate.day,
		);
	}
}
