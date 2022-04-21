import Joi from 'joi';

import { WebLink } from '../entities/WebLink';
import { WebLinkCategory } from '../models/WebLinkCategory';

export class WebLinkObject {
	static readonly schema = Joi.object<WebLinkObject>({
		url: Joi.string().required().trim(),
		category: Joi.string()
			.required()
			.trim()
			.valid(...Object.values(WebLinkCategory)),
	});

	readonly url: string;
	readonly category: WebLinkCategory;

	constructor(webLink: WebLink) {
		this.url = webLink.url.url;
		this.category = webLink.category;
	}
}
