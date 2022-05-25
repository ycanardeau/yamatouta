import Joi from 'joi';

export class EntryListRevisionsParams {
	constructor(readonly id: number) {}

	static readonly schema = Joi.object<EntryListRevisionsParams>({
		id: Joi.number().required(),
	});
}
