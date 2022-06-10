import Joi from 'joi';

export class AdminUpdateSearchIndexParams {
	constructor(readonly forceUpdate: boolean) {}

	static readonly schema = Joi.object<AdminUpdateSearchIndexParams>({
		forceUpdate: Joi.boolean().required(),
	});
}
