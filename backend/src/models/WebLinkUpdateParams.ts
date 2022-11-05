import { WebLinkCategory } from '@/models/WebLinkCategory';
import Joi from 'joi';

export class WebLinkUpdateParams {
	constructor(
		readonly id: number,
		readonly url: string,
		readonly title: string,
		readonly category: WebLinkCategory,
	) {}

	static readonly schema = Joi.object<WebLinkUpdateParams>({
		id: Joi.number().required(),
		url: Joi.string().required().trim().uri(),
		title: Joi.string().required().trim().allow(''),
		category: Joi.string()
			.required()
			.trim()
			.valid(...Object.values(WebLinkCategory)),
	});
}
