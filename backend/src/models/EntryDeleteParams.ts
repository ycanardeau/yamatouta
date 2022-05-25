import Joi from 'joi';

export class EntryDeleteParams {
	constructor(readonly id: number) {}

	static readonly schema = Joi.object<EntryDeleteParams>({
		id: Joi.number().required(),
	});
}
