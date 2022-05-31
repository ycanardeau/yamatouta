import Joi from 'joi';

export class PartialDateUpdateParams {
	constructor(
		readonly year?: number,
		readonly month?: number,
		readonly day?: number,
	) {}

	static readonly schema = Joi.object<PartialDateUpdateParams>({
		year: Joi.number().optional(),
		month: Joi.number().optional().min(1).max(12),
		day: Joi.number().optional().min(1).max(31),
	});
}
