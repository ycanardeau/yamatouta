import { PartialDate } from '../../entities/PartialDate';

export class PartialDateSnapshot {
	readonly year?: number;
	readonly month?: number;
	readonly day?: number;

	constructor(partialDate: PartialDate) {
		this.year = partialDate.year;
		this.month = partialDate.month;
		this.day = partialDate.day;
	}
}
