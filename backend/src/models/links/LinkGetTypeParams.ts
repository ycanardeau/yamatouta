import Joi from 'joi';

export class LinkGetTypeParams {
	static readonly schema = Joi.object<LinkGetTypeParams>({
		id: Joi.number().required(),
	});

	constructor(readonly id: number) {}
}
