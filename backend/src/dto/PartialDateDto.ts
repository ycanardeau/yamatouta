import { PartialDate } from '@/entities/PartialDate';

export class PartialDateDto {
	_partialDateDtoBrand: any;

	private constructor(
		readonly year?: number,
		readonly month?: number,
		readonly day?: number,
	) {}

	static create(partialDate: PartialDate): PartialDateDto {
		return new PartialDateDto(
			partialDate.year,
			partialDate.month,
			partialDate.day,
		);
	}
}
