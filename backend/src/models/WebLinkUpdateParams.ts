import Joi from 'joi';

import { WebLinkCategory } from './WebLinkCategory';

export class WebLinkUpdateParams {
	constructor(
		readonly id: number,
		readonly url: string,
		readonly title: string,
		readonly category: WebLinkCategory,
	) {}

	static readonly schema = Joi.object<WebLinkUpdateParams>({
		id: Joi.number().required(),
		url: Joi.string().required().trim().allow('').uri(),
		title: Joi.string().required().trim().allow(''),
		category: Joi.string()
			.required()
			.trim()
			.valid(...Object.values(WebLinkCategory)),
	});
}
